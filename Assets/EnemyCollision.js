﻿private var player;
private var playerScript;
private var enemyScript;

function Start()
{
	player = GameObject.FindGameObjectWithTag("Player");
	playerScript = player.GetComponent("PlayerScript");
	enemyScript = gameObject.GetComponent("EnemyScript");
	Debug.Log(enemyScript);
}

function OnTriggerEnter2D(coll: Collider2D) {
	
//	Debug.Log("EnemyCollision. Enemy state = "+enemyScript.getState());
	
	if (coll.gameObject.tag == "PlayerCollision" && enemyScript.getState() != 7 && enemyScript.getState() != 8)
	{
		var playerState = playerScript.GetState();
		
		if (playerState == 2 || playerState == 3 || playerState == 4)
		{
			Debug.Log("Enemy Hit");
			
//			var enemy = GameObject.FindGameObjectWithTag("Enemy");	
//			enemy.SendMessage("Hit", 10);
			var args = new int[2];
			args[0] = 10;
			args[1] = playerState;
			this.SendMessage("Hit", args);
		}
		else if (playerState == 6)
		{
			this.SendMessage("knockDown", 10);
		}
	}	
}