using UnityEngine;
using System.Collections;

public class CameraScript : MonoBehaviour {

	private float leftBound;
	private float rightBound;

	// Use this for initialization
	void Start () {
	
		leftBound = 0.0f;
		rightBound = 10.0f;
	}
	
	// Update is called once per frame
	void Update () {
	
//		Debug.Log ("Before transform.position.x = " + transform.position.x);
		if (transform.position.x > rightBound)
		{
			Vector3 temp = transform.position;
			temp.x = rightBound;
			transform.position = temp;

//			Component followScript = gameObject.GetComponent ("SmoothFollow2");
//			followScript.SendMessage("SetFollow(false)");
		}

		if (transform.position.x < leftBound)
		{
			Vector3 temp = transform.position;
			temp.x = leftBound;
			transform.position = temp;
		}
//		Debug.Log ("After transform.position.x = " + transform.position.x);
	}
}
