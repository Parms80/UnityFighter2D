﻿#pragma strict

var speed : float = 0.05;
var targetPosition : Vector3;
var facingRight : boolean;
var startingHealth : int = 100;
var hitSound : AudioClip;
var kickedSound : AudioClip;
var deadSound : AudioClip;
var hitsToFall : int;
private var anim : Animator;

private var enemyState : int;
private var enemyHealth : int;
private var timer : float;
private var velocityY : float;
private var hitCount : int;
private var timeSinceLastHit : float;

private var ENEMY_IDLE = 0;
private var ENEMY_WALKING = 1;
private var ENEMY_PUNCHING = 2;
private var ENEMY_PUNCHING_2 = 3;
private var ENEMY_KICKING = 4;
private var ENEMY_JUMPING = 5;
private var ENEMY_HIT = 6;
private var ENEMY_FALLING = 7;
private var ENEMY_DOWN = 8;

function Start () {

	anim = GetComponent("Animator");
	facingRight = true;
	enemyState = ENEMY_WALKING;
	enemyHealth = startingHealth;
	hitCount = 0;
}

function Update () {

	switch (enemyState)
	{
		case ENEMY_IDLE:
			
			enemyState = ENEMY_WALKING;
		
		break;

		case ENEMY_WALKING:
		
			// Find player position
			var player = GameObject.Find("Player");
			
			if (player != null)
			{
				var playerPosition = player.transform.position;
					
				// Set this object's target position to the player position
				targetPosition = playerPosition;
				
				var distanceTmp = targetPosition - this.transform.position;
				
				// Move this
				this.transform.position += distanceTmp.normalized * speed;
	//			this.transform.position.y = 0.0;
				
				var directionToCharacter = playerPosition - this.transform.position;
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
		
		case ENEMY_HIT:
			
			timeSinceLastHit = Time.time;
			
			if (Time.time - timer > 0.1)
			{
				enemyState = ENEMY_IDLE;
				anim.StopPlayback();
			}
		break;	
		
		case ENEMY_FALLING:
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
				enemyState = ENEMY_DOWN;
				timer = Time.time;
			}
		break;
		
		case ENEMY_DOWN:
		
			if (Time.time - timer > 1.0)
			{
				if (enemyHealth <= 0)		// If dead
				{
//					this.active = false;
					gameObject.SetActive(false);
					
//					var level : GameObject = GameObject.Find("Gameplay");
					
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
					enemyState = ENEMY_IDLE;
				}
			}
		break;
		
		case ENEMY_PUNCHING:
		
//			if (!anim.GetCurrentAnimatorStateInfo(0).IsName("Punch"))
			if (anim.GetCurrentAnimatorStateInfo(0).normalizedTime > 1 && !anim.IsInTransition(0))
			{
				enemyState = ENEMY_IDLE;
//				anim.StopPlayback();
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
//		enemyState = ENEMY_FALLING;
//		anim.Play("Fall", 0);
//		velocityY = 0.03;
		knockDown(damage);
	}
	else
	{
		enemyState = ENEMY_HIT;
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

	enemyState = ENEMY_FALLING;
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
	if (enemyState == ENEMY_WALKING)
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
			enemyState = ENEMY_PUNCHING;
//			timer = Time.time;
		}
	}
}

function getState()
{
	return enemyState;
}