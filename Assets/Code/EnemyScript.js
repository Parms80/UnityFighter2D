#pragma strict

var speed : float = 0.05;
var facingRight : boolean;
var startingHealth : int = 100;
var hitSound : AudioClip;
var kickedSound : AudioClip;
var deadSound : AudioClip;
var jumpSound : AudioClip;
var jumpStrength : int;
var hitsToFall : int;
var flyKickEnabled : boolean;


private var player : GameObject;

private var levelScript : LevelScript;

private var anim : Animator;
private var enemyState : int;
private var enemyHealth : int;
private var timer : float;
private var velocityY : float;
private var hitCount : int;
private var timeSinceLastHit : float;
private var stateSwitchTimer : float;
private var nextStateTime : int;
private var grounded : boolean;
private var groundCheck : Transform;


function Start () {

	anim = GetComponent(Animator);
	player = GameObject.Find("Player");
	facingRight = true;
	groundCheck = transform.Find("groundCheck");
	Reset();
	
	var level : GameObject = GameObject.Find("Level");
	levelScript = level.GetComponent("LevelScript");
}

function Reset()
{
	enemyState = Constants.ENEMY_WALKING;
	enemyHealth = startingHealth;
	hitCount = 0;
	stateSwitchTimer = Time.time;
	setNextStateTime();
}

function Update () {

	grounded = Physics2D.Linecast(transform.position, groundCheck.position, 1 << LayerMask.NameToLayer("Ground"));

	switch (enemyState)
	{
		case Constants.ENEMY_IDLE:
			
			enemyState = Constants.ENEMY_WALKING;
		
		break;

		case Constants.ENEMY_WALKING:
		
			if (player != null)
			{	
				var distanceTmp = player.transform.position - this.transform.position;
				var playerState : int = player.GetComponent(PlayerScript).GetState();
				
				// Check if player is close and walking towards them
				if (Mathf.Abs(distanceTmp.x) < 4.0f && playerState == 1 && 
					Time.time - stateSwitchTimer > nextStateTime)
				{
					// Walk backwards
					stateSwitchTimer = Time.time;
					setNextStateTime();
					enemyState = Constants.ENEMY_WALKING_BACK;
				}
				else
				{
					// Walk forwards
					this.transform.position += distanceTmp.normalized * speed;
				}
				
				// Make sprite face the player
				var directionToCharacter = player.transform.position - this.transform.position;
				directionToCharacter.y = 0;
				
				if (directionToCharacter.x < 0 && facingRight)
				{
					transform.localScale.x *= -1;
					facingRight = false;
				}
				else if (directionToCharacter.x > 0 && !facingRight)
				{
					transform.localScale.x *= -1;
					facingRight = true;
				}
			
				checkPunch();
			}
			
			anim.Play("Walk");
			
		break;
		
		case Constants.ENEMY_WALKING_BACK:
			
			if (player != null)
			{
				distanceTmp = player.transform.position - this.transform.position;
				this.transform.position -= distanceTmp.normalized * speed/2;
				
				directionToCharacter = player.transform.position - this.transform.position;
				directionToCharacter.y = 0;
				
				if (directionToCharacter.x < 0 && facingRight)
				{
					transform.localScale.x *= -1;
					facingRight = false;
				}
				else if (directionToCharacter.x > 0 && !facingRight)
				{
					transform.localScale.x *= -1;
					facingRight = true;
				}
					
				if (Time.time - stateSwitchTimer > nextStateTime) 
				{
					stateSwitchTimer = Time.time;
					setNextStateTime();

					if (flyKickEnabled)
					{
						doFlyingKick();
					}
					else
					{
						enemyState = Constants.ENEMY_WALKING;
					}
				}
			
				checkPunch();
			}
		break;
		
		case Constants.ENEMY_HIT:
			
			timeSinceLastHit = Time.time;
			
			if (Time.time - timer > 0.1)
			{
				enemyState = Constants.ENEMY_IDLE;
				anim.StopPlayback();
			}
		break;	
		
		case Constants.ENEMY_FALLING:
//			player = GameObject.Find("Player");
//			playerPosition = player.transform.position;
//			directionToCharacter = playerPosition - this.transform.position;
//			
//			if (directionToCharacter.x < 0)
//			{
//				this.transform.position.x += 0.02;
//			}
//			else
//			{
//				this.transform.position.x -= 0.02;
//			}
//			this.transform.position.y += velocityY;
//			velocityY -= 0.005;
//			
			
			if (this.transform.position.y <= 0.0)
			{
				enemyState = Constants.ENEMY_DOWN;
				timer = Time.time;
			}
		break;
		
		case Constants.ENEMY_DOWN:
		
			if (Time.time - timer > 1.0)
			{
				if (enemyHealth <= 0)		// If dead
				{
//					this.active = false;
					gameObject.SetActive(false);
					
					if (levelScript.CountEnemies() == 0)
					{
//						levelScript.ProgressToNextSection();
						levelScript.SetGameState(1);
					}
					
//					Debug.Log("num enemies = "+level.GetComponent(Level).countEnemies());
					// If defeated all enemies, progress level and spawn new enemies
//					if (level.GetComponent(Level).countEnemies() == 1 && level.GetComponent(Level).levelProgress < 2)
					{
//						level.GetComponent(Level).levelProgress++;
//						level.GetComponent(Level).spawnEnemies();
						
//						var hand = GameObject.Find("Hand");
//						hand.GetComponent(HandScript).showHand();
						
//						if (level.GetComponent(Level).levelProgress == 2)
//						{
//							var camera = GameObject.Find("Main Camera");
//							camera.GetComponent(MusicPlayer).loadNextTrack();
//						}
					}
				}
				else
				{
					enemyState = Constants.ENEMY_IDLE;
				}
			}
		break;
		
		case Constants.ENEMY_PUNCHING:
		
//			if (!anim.GetCurrentAnimatorStateInfo(0).IsName("Punch"))
			if (anim.GetCurrentAnimatorStateInfo(0).normalizedTime > 1 && !anim.IsInTransition(0))
			{
				enemyState = Constants.ENEMY_IDLE;
//				anim.StopPlayback();
			}
			
		break;
		
		case Constants.ENEMY_FLYING_KICK:
		
			
			if (grounded)
			{
				enemyState = Constants.ENEMY_IDLE;
//				anim.SetBool("is jumping", false);
			}
		break;
			
	}
}

function Hit (args : int[]) {
	var damage = args[0];
	var playerState = args[1];
	
	enemyHealth -= damage;

	if (Time.time - timeSinceLastHit < 0.5)
	{
		hitCount++;
	}
	else
	{
		hitCount = 1;
	}
	
	if (enemyHealth <= 0 || hitCount == hitsToFall) 
	{
//		enemyState = Constants.ENEMY_FALLING;
//		anim.Play("Fall", 0);
//		velocityY = 0.03;
		knockDown(damage);
	}
	else
	{
		enemyState = Constants.ENEMY_HIT;
		anim.Play("Hit", 0);
		timer = Time.time;
	}
	
	if (playerState == 2 || playerState == 3)
	{
		AudioSource.PlayClipAtPoint(hitSound, this.transform.position);
	}
	else
	{
		AudioSource.PlayClipAtPoint(kickedSound, this.transform.position);
	}
}

function knockDown (damage : int) {

	enemyState = Constants.ENEMY_FALLING;
	anim.Play("Fall", 0);
	velocityY = 0.03;
	AudioSource.PlayClipAtPoint(hitSound, this.transform.position);
	var knockBackForce = 1000f;
	
	if (enemyHealth <= 0)
	{
		AudioSource.PlayClipAtPoint(deadSound, this.transform.position);
		knockBackForce = 1500f;
	}
	
	// Check which side of player enemy is on
	var player = GameObject.Find("Player");
	var playerPosition = player.transform.position;
	var directionToCharacter = playerPosition - this.transform.position;
	
	// Knock him back
	if (directionToCharacter.x > 0)
	{
		rigidbody2D.AddForce(new Vector2(-knockBackForce, knockBackForce));
	}
	else
	{
		rigidbody2D.AddForce(new Vector2(knockBackForce, knockBackForce));
	}
}

function isEnemyWalking()
{
	if (enemyState == Constants.ENEMY_WALKING)
	{
		return true;
	}
	else
	{
		return false;
	}
}


function checkPunch()
{
	// Find player position
	var player = GameObject.Find("Player");
	var xDistance = (player.transform.position.x - this.transform.position.x);
	
	var yDistance = Mathf.Abs(this.transform.position.y - player.transform.position.y);
	
	if (yDistance < 1.0)
	{
		if ((facingRight && xDistance > 0.0 && xDistance < 1.5) ||
			(!facingRight && xDistance < 0.0 && xDistance > -1.5))
		{
			anim.StopPlayback();
//			player.SendMessage("Hit", 10);
			anim.Play("Punch");
			enemyState = Constants.ENEMY_PUNCHING;
//			timer = Time.time;
		}
	}
}

function doFlyingKick()
{
	anim.StopPlayback();
	enemyState = Constants.ENEMY_FLYING_KICK;
	
	if (facingRight)
	{	
		rigidbody2D.AddForce(new Vector2(1000f, jumpStrength));
	}
	else
	{
		rigidbody2D.AddForce(new Vector2(-1000f, jumpStrength));
	}
	
	anim.Play("Flying kick");
	AudioSource.PlayClipAtPoint(jumpSound, this.transform.position);
}

public function getState()
{
	return enemyState;
}

function setNextStateTime()
{
	nextStateTime = Random.Range(1,3);
}