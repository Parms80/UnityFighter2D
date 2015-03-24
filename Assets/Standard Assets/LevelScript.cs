using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class LevelScript : MonoBehaviour {

//	public NewObjectPoolScript poolScript;
//	public SmoothFollow2 smoothFollowScript;
	public GameObject boundary;
	public Camera camera;
	public GameObject rightStopTrigger;
	public GameObject leftStopTrigger;
	public Transform player; 
	public GameObject goObject;

	private int gameState;
	private int currentSection;
	private float[] triggerXPositions = {6.4f, 12.42f, 
	                                   13.0f, 20.0f, 
		21.0f, 28.0f};

	private const int GAMESTATE_FIGHTING = 0;
	private const int GAMESTATE_CLEARED_ENEMIES = 1;
	private const int GAMESTATE_NEXT_SECTION = 2;

	// Use this for initialization
	void Start () {

		GameObject objectPool = GameObject.Find ("Object Pooler");
		Component comp = objectPool.GetComponent <NewObjectPoolScript>();

		currentSection = 0;

//		// Spawn Abobo
//		GameObject obj = NewObjectPoolScript.current.GetPooledObject(0);
//	
//		if (obj == null)
//		{
//			return;
//		}
//		obj.transform.position = new Vector2 (5, 0);
//		obj.SetActive (true);

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

		switch (gameState)
		{
		case GAMESTATE_CLEARED_ENEMIES:

			if (player.position.x > leftStopTrigger.transform.position.x)
			{
				ProgressToNextSection();
				SetGameState(GAMESTATE_NEXT_SECTION);
			}
			break;
		}
	}

	public void SetGameState(int state)
	{
		gameState = state;
	}

	public int CountEnemies()
	{
		GameObject[] enemies = GameObject.FindGameObjectsWithTag ("Enemy");

		return enemies.Length;
	}

	public void ProgressToNextSection()
	{
		currentSection++;
		Debug.Log ("currentSection = " + currentSection);

		boundary.SetActive (false);

		Vector3 pos = leftStopTrigger.transform.position;
		pos.x = triggerXPositions[currentSection*2];
		leftStopTrigger.transform.position = pos;

		pos.x = triggerXPositions[currentSection*2 + 1];
		rightStopTrigger.transform.position = pos;

		Component script = camera.GetComponent ("SmoothFollow2");
		script.SendMessage("SetFollow", true);

//		goObject.SetActive (true);
//		script = goObject.GetComponent ("GoScript");
//		script.SendMessage("StartGo", SendMessageOptions.RequireReceiver);
	}
}
