using UnityEngine;
using System.Collections;

public class StopScrolling : MonoBehaviour {

	public SmoothFollow2 smoothFollowScript;
	public GameObject boundary;
	public Transform player;
	public bool isRight;
	public bool active;
	public Camera camera;

	// Use this for initialization
	void Start () {
	
		active = false;
	}
	
	// Update is called once per frame
	void Update () {

		if (player != null)
		{
			if (isRight)
			{
				if (!active && player.transform.position.x >= this.transform.position.x) 
				{
					active = true;
					smoothFollowScript.SetFollow(false);

					Vector3 pos = new Vector3(1, 0.5f, camera.nearClipPlane);
					boundary.transform.position = camera.ViewportToWorldPoint (pos);

					if (!boundary.activeSelf)
					{
						boundary.SetActive(true);
					}
				}
				else if (active && player.transform.position.x <= this.transform.position.x)
				{
					active = false;
					smoothFollowScript.SetFollow(true);
				}
			}
			else
			{
				if (!active && player.transform.position.x < this.transform.position.x) 
				{
					active = true;
					smoothFollowScript.SetFollow(false);

					Vector3 pos = new Vector3(0, 0.5f, -camera.nearClipPlane);
					boundary.transform.position = camera.ViewportToWorldPoint (pos);
					
					if (!boundary.activeSelf)
					{
						boundary.SetActive(true);
					}
				}
				else if (active && player.transform.position.x > this.transform.position.x)
				{
					active = false;
					smoothFollowScript.SetFollow(true);
				}
			}
		}
	}
}
