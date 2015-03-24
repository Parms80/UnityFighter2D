using UnityEngine;
using System.Collections;

public class EnemyAI : MonoBehaviour {

	public Transform player;
	private int mode;
	private float modeSwitchTimer;
//	private EnemyScript enemyScript;

	private const int WALK_TO_PLAYER = 0;

	// Use this for initialization
	void Start () {
		mode = WALK_TO_PLAYER;
		modeSwitchTimer = Time.time;
//		enemyScript = GetComponent("EnemyScript");
	}
	
	// Update is called once per frame
	void Update () {
	
		if (Time.time - modeSwitchTimer > 4) 
		{
			mode = Random.Range (0, 3);
		}

		switch (mode)
		{
			case WALK_TO_PLAYER:
				walkToPlayer();
			break;
		}
	}

	void walkToPlayer()
	{
		Vector3 playerPosition = player.transform.position;
		
		// Set this object's target position to the player position
		Vector3 targetPosition = playerPosition;
		
		Vector3 distanceTmp = targetPosition - this.transform.position;

		
		// Move this
//		this.transform.position += distanceTmp.normalized * gameObject.GetComponent("speed");
	}
}
