function OnTriggerEnter2D(coll: Collider2D) {
	
	
	var playerScript = gameObject.GetComponent("PlayerScript");
	var playerState = playerScript.GetState();
	
	if (coll.gameObject.tag == "EnemyCollision")
	{
		var enemyScript = coll.transform.parent.gameObject.GetComponent("EnemyScript");
		var enemyState = enemyScript.getState();
		
		if (enemyState == Constants.ENEMY_FLYING_KICK)
		{
			this.SendMessage("knockDown", 10);
		}
		else if (playerState != Constants.PLAYER_FALLING && playerState != Constants.PLAYER_DOWN)
		{
			this.SendMessage("Hit", 10);
		}
	}
}
