function OnTriggerEnter2D(coll: Collider2D) {
	
	
	var playerScript = gameObject.GetComponent("PlayerScript");
	var playerState = playerScript.GetState();
	
	if (coll.gameObject.tag == "EnemyCollision")
	{
		var enemyScript = coll.transform.parent.gameObject.GetComponent("EnemyScript");
		var enemyState = enemyScript.getState();
		
		if (enemyState == 10)
		{
			this.SendMessage("knockDown", 10);
		}
		else if (playerState != 7 && playerState != 9)
		{
			this.SendMessage("Hit", 10);
		}
	}
}
