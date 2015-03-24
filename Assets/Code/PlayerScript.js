#pragma strict

var moveSpeed : float = 8;
var hitSound : AudioClip;
var attackSound : AudioClip;
var jumpSound : AudioClip;
var deadSound : AudioClip;
var jumpStrength : float = 400.0;
//var mass : float = 0.5;
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
private var groundCheck : Transform;			// A position marking where to check if the player is grounded.
private var timer : float;
private var facingRight : boolean;
private var health : int;
private var attackMove : int;
private var timeSinceLastHit : float;
private var hitCount : int;
private var freezeStartTime : int;
private var frozen : boolean;

//private var punchingHash = Animator.StringToHash("punching");
	
private var playerState : int;

public static var PLAYER_STANDING = 0;
public static var PLAYER_WALKING = 1;
private var PLAYER_PUNCHING = 2;
private var PLAYER_PUNCHING_2 = 3;
private var PLAYER_KICKING = 4;
private var PLAYER_JUMPING = 5;
private var PLAYER_FLYING_KICK = 6;
private var PLAYER_FALLING = 7;
private var PLAYER_HIT = 8;
private var PLAYER_DOWN = 9;

private var stateStrings = ["PLAYER_STANDING", 
							"PLAYER_WALKING",
							"PLAYER_PUNCHING",
							"PLAYER_PUNCHING_2",
							"PLAYER_KICKING",
							"PLAYER_JUMPING",
							"PLAYER_FLYING_KICK",
							"PLAYER_FALLING",
							"PLAYER_HIT",
							"PLAYER_DOWN"];

function Start () {
	anim = GetComponent(Animator);
	xScale = transform.localScale.x; // Get correct orientation for player
	playerState = PLAYER_STANDING;
	groundCheck = transform.Find("groundCheck");
	health = 100;
	hitCount = 0;
	Debug.Log("this = "+this);
	frozen = false;
}

function Update () {

	punchPressed = Input.GetKeyDown(KeyCode.C);
	kickPressed = Input.GetKeyDown(KeyCode.Z);
	jumpPressed = Input.GetKeyDown(KeyCode.X);
	horizontalInput = Input.GetAxisRaw("Horizontal");
	verticalInput = Input.GetAxisRaw("Vertical");	

	grounded = Physics2D.Linecast(transform.position, groundCheck.position, 1 << LayerMask.NameToLayer("Ground"));

	if (frozen)
	{
		var	freezeTime = Time.time - freezeStartTime;
		Debug.Log("Freeze time = "+freezeTime);
		if (freezeTime > 0.5)
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
    	case PLAYER_STANDING:
    	case PLAYER_WALKING:
    	
			doPlayerWalk();
			
			if (punchPressed)
			{
				doPunch(attackMove);
			}
			else if (!punchPressed)
			{
//				anim.SetBool(punchingHash, false);
			}

			if (kickPressed)
			{
				doKick();
			}
			else if (!kickPressed)
			{
//				anim.SetBool("kicking", false);
			}

			if (jumpPressed && grounded)
//			if (jumpPressed && transform.position.y == 0.0)
			{
				doJump();
			}
			
    	break;
    	
    	case PLAYER_JUMPING:
    	
			if (kickPressed)
			{
				playerState = PLAYER_FLYING_KICK;
				anim.StopPlayback();
				anim.Play("flying_kick");
				AudioSource.PlayClipAtPoint(attackSound, this.transform.position);
			}
    	case PLAYER_FLYING_KICK:
    
//			transform.position += transform.up * jumpSpeed * Time.deltaTime;
			transform.position.x +=  horizontalJumpVelocity * Time.deltaTime;
//			jumpSpeed -= mass;
			
			
			if (grounded)
			{
				playerState = PLAYER_STANDING;
//				anim.SetBool("is jumping", false);
			}
		
		break;
		
		case PLAYER_PUNCHING:
		
//			Debug.Log("punchPressed = "+punchPressed);
			if (punchPressed)
			{
				doPunch(1);
			}
			else
//			anim.SetBool(punchingHash, false);
//			if (!anim.animation.IsPlaying("Player punch"))
			if ((attackMove == 1 && !anim.GetCurrentAnimatorStateInfo(0).IsName("player_jab_1")) ||
				(attackMove == 2 && !anim.GetCurrentAnimatorStateInfo(0).IsName("player_cross")))
//			if (anim.GetCurrentAnimatorStateInfo(0).normalizedTime > 1 && !anim.IsInTransition(0))
			{
				playerState = PLAYER_STANDING;
			}
			
		break;
		
		case PLAYER_KICKING:
		
//			if (!anim.animation.IsPlaying("Player kick"))
			if (!anim.GetCurrentAnimatorStateInfo(0).IsName("kick_1"))
//			if (anim.GetCurrentAnimatorStateInfo(0).normalizedTime > 1 && !anim.IsInTransition(0))
			{
				playerState = PLAYER_STANDING;
			}
			
		break;
		
		case PLAYER_HIT:
			
			timeSinceLastHit = Time.time;
			
			if (Time.time - timer > 0.1)
			{
				playerState = PLAYER_STANDING;
				anim.StopPlayback();
			}
			
		break;	
		
		case PLAYER_FALLING:
		
			if (this.transform.position.y <= 0.0 && this.rigidbody2D.velocity.y < 0.0f)
			{
				playerState = PLAYER_DOWN;
				timer = Time.time;
				anim.Play("Down");
			}
			
		break;
		
		case PLAYER_DOWN:
		
			if (Time.time - timer > 1.0)
			{
				if (health <= 0)		// If dead
				{
					gameObject.SetActive(false);
				}
				else
				{
					playerState = PLAYER_STANDING;
				}
			}
		
		break;
	}
	
	// Reset combo after certain time
	if (Time.time - timer > 0.5)
	{
//		anim.SetInteger("attack move", 0);
		attackMove = 0;
	}
	}
}

function doPlayerWalk()
{
	var moveH : float = horizontalInput * moveSpeed * Time.deltaTime;	// Smooth horizontal movement
	
	
//	if (!anim.GetCurrentAnimatorStateInfo(0).IsName("Player punch") &&
//		!anim.GetCurrentAnimatorStateInfo(0).IsName("Player kick") &&
//		playerState != PLAYER_JUMPING)	
	{	
		// Flip character movement
		if (horizontalInput < 0)
		{
	    	transform.localScale.x = xScale;
	    	facingRight = false;
	    	//transform.Translate(-Vector3.right * moveSpeed * Time.deltaTime);
	    	transform.Translate(Vector3.right * moveH);
//			anim.SetBool("walking", true);
			playerState = PLAYER_WALKING;
			anim.Play("player_walk");
	    } 
	    else if(horizontalInput > 0)
	    {
	    	transform.localScale.x = -xScale;
	    	facingRight = true;
	    	//transform.Translate(Vector3.right * moveSpeed * Time.deltaTime);
	    	transform.Translate(Vector3.right * moveH);
//			anim.SetBool("walking", true);
			playerState = PLAYER_WALKING;
			anim.Play("player_walk");
	    }    
	    
	    if (horizontalInput == 0)
	    {
	    	anim.StopPlayback();
	    	playerState = PLAYER_STANDING;
	    	anim.Play("player_idle");
	    }
    }
}

function doPunch(move : int)
{
	anim.StopPlayback();	
//	anim.SetTrigger(punchingHash);
	playerState = PLAYER_PUNCHING;
	AudioSource.PlayClipAtPoint(attackSound, this.transform.position);
	
	timer = Time.time;
	
//	if (anim.GetInteger("attack move").Equals(0) || anim.GetInteger("attack move").Equals(2))
	if (move == 0 || move == 2)
	{
//		anim.SetInteger("attack move", 1);
		attackMove = 1;
		anim.Play("player_jab_1", 0);
	}
	else
	{
//		anim.SetInteger("attack move", 2);
		attackMove = 2;
		anim.Play("player_cross", 0);
	}
	
//	checkHitEnemy();
}

function doKick()
{
	anim.StopPlayback();	
//	anim.SetTrigger("kicking");
	playerState = PLAYER_KICKING;
	AudioSource.PlayClipAtPoint(attackSound, this.transform.position);

//	if (anim.GetInteger("attack move").Equals(0))
//	{
//		anim.SetInteger("attack move", 3);
//	}
//	if (attackMove == 0)
	{
		attackMove = 3;
		anim.Play("kick_1");
	}
	
//	checkHitEnemy();
}

function doJump()
{
	anim.StopPlayback();	
//	jumpSpeed = jumpStrength;
	playerState = PLAYER_JUMPING;
	horizontalJumpVelocity = horizontalInput * moveSpeed;
	rigidbody2D.AddForce(new Vector2(0f, jumpStrength));
	anim.Play("player_jump");
	AudioSource.PlayClipAtPoint(jumpSound, this.transform.position);
}

/*
function checkHitEnemy()
{
	for (var enemy : GameObject in GameObject.FindGameObjectsWithTag("Enemy"))
	{
		if (enemy != null)
		{
			if (enemy.GetComponent(EnemyScript).isEnemyWalking())
			{	
				var xDistance = (enemy.transform.position.x - this.transform.position.x);
				var yDistance = Mathf.Abs(this.transform.position.y - enemy.transform.position.y);
				
				if (yDistance < 1.0)
				{
//					switch (attackMove)
//					{
//						case ATTACKMOVE_PUNCH_2:
//						
//							if ((facingRight && xDistance > 0.0 && xDistance < 2.6) ||
//								(!facingRight && xDistance < 0.0 && xDistance > -2.6))
//							{
//								enemy.SendMessage("Hit", 10);
//							}
//							
//						break;
//					}
				}
			}
		}
	}
}
*/

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
//		playerState = PLAYER_FALLING;
//		anim.Play("Fall", 0);
//		velocityY = 0.05;
		knockDown(damage);
	}
	else
	{
		playerState = PLAYER_HIT;
		anim.Play("Hit", 0);
		timer = Time.time;
	}
	
	AudioSource.PlayClipAtPoint(hitSound, this.transform.position);
}

function knockDown (damage : int) {

	playerState = PLAYER_FALLING;
	anim.Play("Fall", 0);
//	velocityY = 0.03;
	AudioSource.PlayClipAtPoint(hitSound, this.transform.position);
	var knockBackForce = 1000f;
	
	if (health <= 0)
	{
		AudioSource.PlayClipAtPoint(deadSound, this.transform.position);
		knockBackForce = 1500f;
	}
	
	// Check which side of player enemy is on
//	var player = GameObject.Find("Player");
//	var playerPosition = player.transform.position;
//	var directionToCharacter = playerPosition - this.transform.position;
	
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

function GetStateString()
{
	return stateStrings;
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