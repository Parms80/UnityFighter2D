using UnityEngine;
using System.Collections;

public class GoScript : MonoBehaviour {

	public Camera camera;

	// Use this for initialization
	void Start () {
	
//		gameObject.renderer.enabled = false;
		gameObject.SetActive(false);
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void StartGo()
	{
//		transformRect.position = camera.ScreenToWorldPoint (new Vector3 (50.0f, 50.0f, camera.nearClipPlane));
//		gameObject.renderer.enabled = true;
	}
}
