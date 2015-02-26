function OnTriggerEnter2D(coll: Collider2D) {
	
	Debug.Log("Player collision");
	
	var playerScript = gameObject.GetComponent("PlayerScript");
	Debug.Log("PlayerCollision: state = "+playerScript.GetState());
	var playerState = playerScript.GetState();
	
	if (coll.gameObject.tag == "EnemyCollision" && playerState != 7 && playerState != 9)
	{
		Debug.Log("Player collision hit");
		this.SendMessage("Hit", 10);
	}
	
//	
//	if (coll.gameObject.tag == "Enemy")
//	{
//		var anim : Animator;
//		anim = GetComponent("Animator");
//		
//		var playerState = anim.GetComponent("playerState");
//		
////		if (anim.GetBool("punch"))
//		Debug.Log("Collision.js: playerState = "+playerState);
//		if (playerState == anim.GetComponent("PLAYER_PUNCHING"))
//		{
//			Debug.Log("Player Hit");
//			
//			var enemy = GameObject.FindGameObjectWithTag("Enemy");	
//			enemy.SendMessage("Hit", 10);
//		}
//	}	
}
