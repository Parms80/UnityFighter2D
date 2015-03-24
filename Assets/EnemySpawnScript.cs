using UnityEngine;
using System.Collections;

public class EnemySpawnScript : MonoBehaviour {

	public float[] spawnPosX;
	public int enemyType;

	private bool spawned;

	// Use this for initialization
	void Start () {
		spawned = false;
	}
	
	void OnTriggerEnter2D(Collider2D coll) {
		
		if (coll.gameObject.tag == "Player" && !spawned)
		{
			GameObject obj;

			for (int i = 0; i < spawnPosX.Length; i++) 
			{
				obj = NewObjectPoolScript.current.GetPooledObject (enemyType);
	
	
				if (obj == null) {
						return;
				}
				obj.transform.position = new Vector2 (spawnPosX[i], 0);
				obj.SetActive (true);
				obj.GetComponent("EnemyScript").SendMessage("Reset");
			}
			spawned = true;
		}
	}
}
