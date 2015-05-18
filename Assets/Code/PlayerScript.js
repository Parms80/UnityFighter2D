#pragma strict

var moveSpeed : float = 8;
var hitSound : AudioClip;
var attackSound : AudioClip;
var jumpSound : AudioClip;
var deadSound : AudioClip;
var jumpStrength : float = 400.0;
var hitsToFall : int = 3;

private var anim : Animator;
private var xScale : float;
private var horizontalInput : float;
private var verticalInput : float;
private var punchPressed : boolean;
private var kickPressed : boolean;
private var jumpPressed : boolean;
private var jumpSpeed : float;
private var horizontalJumpVelocity : float;
private var grounded : boolean;
private var groundCheck : Transform;
private var timer : float;
private var facingRight : boolean;
private var health : int;
private var attackMove : int;
private var timeSinceLastHit : float;
private var hitCount : int;
private var freezeStartTime : int;
private var frozen : boolean;
private var playerState : int;



function Start () {
	anim = GetComponent(Animator);
	xScale = transform.localScale.x; 				// Get correct orientation for player
	playerState = Constants.PLAYER_STANDING;
	groundCheck = transform.Find("groundCheck");
	health = 100;
	hitCount = 0;
	frozen = false;
}

function Update(){

	punchPressed = Input.GetKeyDown(KeyCode.C);
	kickPressed = Input.GetKeyDown(KeyCode.Z);
	jumpPressed = Input.GetKeyDown(KeyCode.X);
	horizontalInput = Input.GetAxisRaw("Horizontal");
	verticalInput = Input.GetAxisRaw("Vertical");	

	grounded = Physics2D.Linecast(transform.position, groundCheck.position, 1 << LayerMask.NameToLayer("Ground"));

	if (frozen)
	{
		var	freezeTime = Time.time - freezeStartTime;
		
		if (freezeTime > Constants.FREEZE_TIME)
		{
			frozen = false;
//			Time.timeScale = 1;
//			rigidbody2D.isKinematic = true;
			anim.speed = 1;
		}
	}
	else
	{
	    switch (playerState)
	    {
	    	case Constants.PLAYER_STANDING:
	    	case Constants.PLAYER_WALKING:
	    	
				doPlayerWalk();
				
				if (punchPressed)
				{
					doPunch(attackMove);
				}

				if (kickPressed)
				{
					doKick();
				}

				if (jumpPressed && grounded)
				{
					doJump();
				}
				
	    	break;
	    	
	    	case Constants.PLAYER_JUMPING:
	    	
				if (kickPressed)
				{
					playerState = Constants.PLAYER_FLYING_KICK;
					anim.StopPlayback();
					anim.Play("flying_kick");
					AudioSource.PlayClipAtPoint(attackSound, this.transform.position);
				}
	    	case Constants.PLAYER_FLYING_KICK:
	    
				transform.position.x +=  horizontalJumpVelocity * Time.deltaTime;
				
				if (grounded)
				{
					playerState = Constants.PLAYER_STANDING;
				}
			
			break;
			
			case Constants.PLAYER_PUNCHING:
			
				if (punchPressed)
				{
					doPunch(Constants.ATTACK_JAB);
				}
				else if ((attackMove == Constants.ATTACK_JAB && !anim.GetCurrentAnimatorStateInfo(0).IsName("player_jab_1")) ||
						 (attackMove == Constants.ATTACK_CROSS && !anim.GetCurrentAnimatorStateInfo(0).IsName("player_cross")))
				{
					playerState = Constants.PLAYER_STANDING;
				}
				
			break;
			
			case Constants.PLAYER_KICKING:
			
				if (!anim.GetCurrentAnimatorStateInfo(0).IsName("kick_1"))
				{
					playerState = Constants.PLAYER_STANDING;
				}
				
			break;
			
			case Constants.PLAYER_HIT:
				
				timeSinceLastHit = Time.time;
				
				if (Time.time - timer > Constants.PLAYER_STUN_TIME)
				{
					playerState = Constants.PLAYER_STANDING;
					anim.StopPlayback();
				}
				
			break;	
			
			case Constants.PLAYER_FALLING:
			
				if (this.transform.position.y <= 0.0 && this.rigidbody2D.velocity.y < 0.0f)
				{
					playerState = Constants.PLAYER_DOWN;
					timer = Time.time;
					anim.Play("Down");
				}
				
			break;
			
			case Constants.PLAYER_DOWN:
			
				if (Time.time - timer > Constants.PLAYER_DOWN_TIME)
				{
					if (health <= 0)		
					{
						gameObject.SetActive(false);
					}
					else
					{
						playerState = Constants.PLAYER_STANDING;
					}
				}
			
			break;
		}
		
		// Reset combo after certain time
		if (Time.time - timer > Constants.COMBO_RESET_TIME)
		{
			attackMove = Constants.ATTACK_NONE;
		}
	}
}

function doPlayerWalk()
{
	var moveH : float = horizontalInput * moveSpeed * Time.deltaTime;	// Smooth horizontal movement
	
	// Flip character movement
	if (horizontalInput < 0)
	{
    	transform.localScale.x = xScale;
    	facingRight = false;
    	transform.Translate(Vector3.right * moveH);
		playerState = Constants.PLAYER_WALKING;
		anim.Play("player_walk");
    } 
    else if(horizontalInput > 0)
    {
    	transform.localScale.x = -xScale;
    	facingRight = true;
    	transform.Translate(Vector3.right * moveH);
		playerState = Constants.PLAYER_WALKING;
		anim.Play("player_walk");
    }    
    
    if (horizontalInput == 0)
    {
    	anim.StopPlayback();
    	playerState = Constants.PLAYER_STANDING;
    	anim.Play("player_idle");
    }
}

function doPunch(move : int)
{
	anim.StopPlayback();	
	playerState = Constants.PLAYER_PUNCHING;
	AudioSource.PlayClipAtPoint(attackSound, this.transform.position);
	timer = Time.time;
	
	if (move == Constants.ATTACK_NONE || move == Constants.ATTACK_CROSS)
	{
		attackMove = Constants.ATTACK_JAB;
		anim.Play("player_jab_1", 0);
	}
	else
	{
		attackMove = Constants.ATTACK_CROSS;
		anim.Play("player_cross", 0);
	}
}

function doKick()
{
	anim.StopPlayback();	
	playerState = Constants.PLAYER_KICKING;
	AudioSource.PlayClipAtPoint(attackSound, this.transform.position);

	attackMove = Constants.ATTACK_KICK;
	anim.Play("kick_1");
}

function doJump()
{
	anim.StopPlayback();	
	playerState = Constants.PLAYER_JUMPING;
	horizontalJumpVelocity = horizontalInput * moveSpeed;
	rigidbody2D.AddForce(new Vector2(0f, jumpStrength));
	anim.Play("player_jump");
	AudioSource.PlayClipAtPoint(jumpSound, this.transform.position);
}


function Hit (damage : int) {
	health -= damage;
	
	if (Time.time - timeSinceLastHit < 0.5)
	{
		hitCount++;
	}
	else
	{
		hitCount = 1;
	}
	
	if (health <= 0 || hitCount == hitsToFall) 
	{
		knockDown(damage);
	}
	else
	{
		playerState = Constants.PLAYER_HIT;
		anim.Play("Hit", 0);
		timer = Time.time;
	}
	
	AudioSource.PlayClipAtPoint(hitSound, this.transform.position);
}

function knockDown (damage : int) {

	playerState = Constants.PLAYER_FALLING;
	anim.Play("Fall", 0);
	
	AudioSource.PlayClipAtPoint(hitSound, this.transform.position);
	var knockBackForce = Constants.KNOCK_BACK_FORCE;
	
	if (health <= 0)
	{
		AudioSource.PlayClipAtPoint(deadSound, this.transform.position);
		knockBackForce = Constants.KNOCK_BACK_FORCE_DEAD;
	}
	
	// Knock back
	if (facingRight)
	{
		rigidbody2D.AddForce(new Vector2(-knockBackForce, knockBackForce));
	}
	else
	{
		rigidbody2D.AddForce(new Vector2(knockBackForce, knockBackForce));
	}
}

function GetState()
{
	return playerState;
}


function SetPauseTime()
{
//	Time.timeScale = 0;
	freezeStartTime = Time.time;	
//	frozen = true;
//	rigidbody2D.isKinematic = true;
//	var gravity = rigidbody2D.gravityScale;
	anim.speed = 0;
//	rigidbody2D.velocity = Vector3(0,0,0);
//	rigidbody2D.gravityScale = 0;
	yield WaitForSeconds(0.1);
	
	anim.speed = 1;
//	rigidbody2D.gravityScale = gravity;
//	rigidbody2D.isKinematic = false;
	
}