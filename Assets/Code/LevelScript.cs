using UnityEngine;
using System.Collections;

public class LevelScript : MonoBehaviour {

	// Use this for initialization
	void Start () {

		GameObject objectPool = GameObject.Find ("Object Pooler");
		Component comp = objectPool.GetComponent <NewObjectPoolScript>();
		Debug.Log ("comp = " + comp);

		// Spawn Abobo
		GameObject obj = NewObjectPoolScript.current.GetPooledObject(0);

		Debug.Log ("LevelScript: obj = " + obj);
	
		if (obj == null)
		{
			return;
		}
		obj.transform.position = new Vector2 (5, 0);
		obj.SetActive (true);

		// Spawn 6 Williamses
//		for (int i = 0; i < 6; i++) 
//		{
//			obj = NewObjectPoolScript.current.GetPooledObject (1);
//
//			Debug.Log ("LevelScript: obj 1 = " + obj);
//
//			if (obj == null) {
//					return;
//			}
//			obj.transform.position = new Vector2 (5*i, 0);
//			obj.SetActive (true);
//		}
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
