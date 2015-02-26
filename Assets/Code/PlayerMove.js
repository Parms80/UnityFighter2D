#pragma strict
var anim : Animator;
var attackTimer : int;
var playerState : int;
var speed : float;
var direction : int;

private var punchPressed : boolean;
private var kickPressed : boolean;
private var jumpPressed : boolean;
private var jumpSpeed : float;
private var horizontalJumpVelocity : float;
private var horizontalInput : float;

private var punchingHash = Animator.StringToHash("punching");

var PLAYER_IDLE = -1;
var PLAYER_JAB_1 = 0;
var PLAYER_JAB_2 = 1;
var PLAYER_CROSS = 2;
var PLAYER_KICK_1 = 3;
var PLAYER_KICK_2 = 4;
var PLAYER_JUMPING = 5;
var PLAYER_WALKING = 6;

var FACING_LEFT = 0;
var FACING_RIGHT = 1;

function Start () {
	anim = GetComponent("Animator");
	playerState = PLAYER_IDLE;
	speed = 1.0f;
	direction = FACING_LEFT;
}

function Update () {

	//anim.SetFloat("speed", Mathf.Abs(Input.GetAxis("Horizontal")));

	punchPressed = Input.GetKeyDown(KeyCode.C);
	kickPressed = Input.GetKeyDown(KeyCode.Z);
	jumpPressed = Input.GetKeyDown(KeyCode.X);
	horizontalInput = Input.GetAxisRaw("Horizontal");
	
	switch (playerState)
	{
	
		case PLAYER_IDLE:
		case PLAYER_WALKING:
    	
			doPlayerWalk();
			
			if (punchPressed)
			{
				doPunch();
			}
//			else if (!punchPressed)
//			{
//				anim.SetBool(punchingHash, false);
//			}

			if (kickPressed)
			{
				doKick();
			}
//			else if (!kickPressed)
//			{
//				anim.SetBool("kicking", false);
//			}

			//	if (jumpPressed && grounded)
			if (jumpPressed && transform.position.y == 0.0)
			{
				anim.StopPlayback();	
//				anim.SetBool("is jumping", true);
				playerState = PLAYER_JUMPING;
				jumpSpeed = 20.0f;
				horizontalJumpVelocity = horizontalInput * speed;
//				anim.SetBool("walking", false);
//				anim.SetBool("walking up", false);
			}
			
		break;
		
	}
	
	if (Input.GetKeyDown(KeyCode.C))
	{
		anim.SetBool("attacking", true);
		anim.SetTrigger("punch");
		attackTimer = 0;
		
		if (playerState == PLAYER_IDLE)
		{
			playerState = PLAYER_JAB_1;
//			DoDamage(10);
		}
		
		anim.SetInteger("attackMove", anim.GetInteger("attackMove")+1);
	}
	else if (Input.GetKeyDown(KeyCode.X))
	{
		anim.SetBool("attacking", true);
		anim.SetTrigger("kick");
		attackTimer = 0;
		anim.SetInteger("attackMove", 4);
	}
	else if (Input.GetAxisRaw("Horizontal") < 0 && !anim.GetBool("attacking"))
	{
		anim.SetFloat("horizontalMovement", 1.0);
		transform.Translate(Vector3.left * speed * Time.deltaTime);
		
		if (direction == FACING_RIGHT)
		{
			transform.localScale.x *= -1;
			direction = FACING_LEFT;
		}
	}
	else if (Input.GetAxisRaw("Horizontal") > 0 && !anim.GetBool("attacking"))
	{
		anim.SetFloat("horizontalMovement", 1.0);
		transform.Translate(Vector3.right * speed * Time.deltaTime);
		//transform.Rotate(0.0, 180.0, 0.0);
		
		if (direction == FACING_LEFT)
		{
			transform.localScale.x *= -1;
			direction = FACING_RIGHT;
		}
	}
	else
	{
		anim.SetFloat("horizontalMovement", 0.0);
	}
	
	
	attackTimer++;
	
	if (attackTimer > 18 && anim.GetBool("attacking"))
	{
		attackTimer = 0;
		anim.SetBool("attacking", false);
		anim.SetInteger("attackMove", 0);
	}
}

function doPlayerWalk()
{
}

function doPunch()
{
}

function doKick()
{
}

//function DoDamage (damage : int) {
//
//	var enemy = GameObject.Find("Enemy");	
//	Debug.Log("distance = " + (enemy.transform.position.x - this.transform.position.x));
//	if (enemy.transform.position.x - this.transform.position.x < 1.0)
//	{
//		enemy.SendMessage("Hit", damage);
//	}
//}