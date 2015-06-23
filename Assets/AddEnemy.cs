using UnityEngine;
using System.Collections;

public class AddEnemy : MonoBehaviour {

	private bool spawned;
	public Rigidbody2D enemy;

	// Use this for initialization
	void Start () {
		spawned = false;
	
	}
	
	void OnTriggerEnter2D(Collider2D coll) {
		
		if (coll.gameObject.tag == "Player" && !spawned)
		{
			Instantiate(enemy, this.transform.position, Quaternion.identity);
			enemy.gameObject.SetActive(true);
			spawned = true;
		}
	}
}
