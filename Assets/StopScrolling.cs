using UnityEngine;
using System.Collections;

public class StopScrolling : MonoBehaviour {

	public SmoothFollow2 smoothFollowScript;
	public GameObject boundary;
	public Transform player;
	public bool isRight;
	public bool active;

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
					boundary.transform.position = camera.ViewportToWorldPoint (Vector3 (1,1, camera.nearClipPlane));
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
