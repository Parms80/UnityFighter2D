private var player;
private var playerScript;
private var enemyScript;
public var constants;

function Start()
{
	player = GameObject.FindGameObjectWithTag("Player");
	playerScript = player.GetComponent(PlayerScript);
	enemyScript = gameObject.GetComponent(EnemyScript);
}

function OnTriggerEnter2D(coll: Collider2D) {
	
	if (coll.gameObject.tag == "PlayerCollision" && enemyScript.getState() != 7 && enemyScript.getState() != 8)
	{
		var playerState = playerScript.GetState();
		
		if (playerState == Constants.PLAYER_PUNCHING || 
			playerState == Constants.PLAYER_PUNCHING_2 || 
			playerState == Constants.PLAYER_KICKING)
		{
//			Debug.Log("Enemy Hit");
			
//			var enemy = GameObject.FindGameObjectWithTag("Enemy");	
//			enemy.SendMessage("Hit", 10);
			var args = new int[2];
			args[0] = 10;
			args[1] = playerState;
			this.SendMessage("Hit", args);
//			playerScript.SetPauseTime();
		}
		else if (playerState == Constants.PLAYER_FLYING_KICK)
		{
			this.SendMessage("knockDown", 10);
			
			playerScript.SetPauseTime();
		}
	}	
}