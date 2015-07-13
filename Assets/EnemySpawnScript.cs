using UnityEngine;
using System.Collections;

public class EnemySpawnScript : MonoBehaviour {

	public bool spawnToRight;
	public int enemyType;
	public Camera camera;

	private bool spawned;

	void Start () {
		spawned = false;
	}
	
	void OnTriggerEnter2D(Collider2D coll) {
		
		if (coll.gameObject.tag == "Player" && !spawned)
		{

			GameObject obj;

			obj = NewObjectPoolScript.current.GetPooledObject (enemyType);


			if (obj == null) 
			{
					return;
			}

			
			float spriteWidth = obj.renderer.bounds.size.x;
			float pixelsPerUnit = 100;
			Vector3 spawnPosition;

			// Place sprite just outside screen
			if (spawnToRight)
			{
				spawnPosition = camera.ScreenToWorldPoint(new Vector3(Screen.width + (spriteWidth/2)*pixelsPerUnit, 0, 0));
				Debug.Log("spriteWidth = "+spriteWidth+ ", spawnPosition.x = "+spawnPosition.x);
			}
			else
			{
				spawnPosition = camera.ScreenToWorldPoint(new Vector3(-spriteWidth/2 * 100, 0, 0));
			}
			spawnPosition.z = 0;

			// Cast a line down through the ground to determine y position of enemy
			Vector2 startPos = new Vector2(spawnPosition.x, 0);
			Vector2 endPos = new Vector2(spawnPosition.x, -50);
			RaycastHit2D groundPos = Physics2D.Linecast(startPos, endPos, 1 << LayerMask.NameToLayer("Ground"));
			spawnPosition.y = groundPos.point.y;

			obj.transform.position = spawnPosition;
			obj.SetActive (true);
			obj.GetComponent("EnemyScript").SendMessage("Reset");

			spawned = true;
		}
	}
}
