using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class LevelScript : MonoBehaviour {

	public GameObject boundary;
	public Camera camera;
	public GameObject rightStopTrigger;
	public GameObject leftStopTrigger;
	public Transform player; 
	public GameObject goObject;

	private int gameState;
	private int currentSection;
	private float[] triggerXPositions = {6.4f, 12.42f, 
	                                     13.0f, 60.0f, 
										 21.0f, 28.0f,
										 29.0f, 34.0f,
										 35.0f, 50.0f,
										 51.0f, 60.0f,
										 64.0f, 74.0f};

	private const int GAMESTATE_FIGHTING = 0;
	private const int GAMESTATE_CLEARED_ENEMIES = 1;
	private const int GAMESTATE_NEXT_SECTION = 2;

	// Use this for initialization
	void Start () {

		GameObject objectPool = GameObject.Find ("Object Pooler");
		Component comp = objectPool.GetComponent <NewObjectPoolScript>();

		currentSection = 0;
	}

	void SpawnEnemy(int enemyType, int x)
	{
		GameObject obj = NewObjectPoolScript.current.GetPooledObject(enemyType);
		
		if (obj == null)
		{
			return;
		}
		obj.transform.position = new Vector2 (x, 0);
		obj.SetActive (true);
		obj.GetComponent("EnemyScript").SendMessage("Reset");
	}

	// Update is called once per frame
	void Update () {

		if (Input.GetKey("escape"))
		{
			Application.Quit();
		}

		switch (gameState)
		{
		case GAMESTATE_CLEARED_ENEMIES:

			if (player.position.x > leftStopTrigger.transform.position.x && currentSection < triggerXPositions.Length/2-1)
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
