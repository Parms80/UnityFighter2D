#pragma strict

public var levelProgress : int;
private var levelProgressBounds = [[-13.0, -10.0], [-10.0, 10.0], [0.0, 40.0]];

function Start () {

	levelProgress = 0;
}

function Update () {

	var camera = GameObject.Find("Main Camera");
//	Debug.Log("camera x = "+camera.transform.position.x);
	
	if (camera.transform.position.x < -13.0)//levelProgressBounds[levelProgress][0])
	{
		camera.transform.position.x = -13.0;//levelProgressBounds[levelProgress][0];
	}
	else if (camera.transform.position.x > levelProgressBounds[levelProgress][1])
	{
		camera.transform.position.x = levelProgressBounds[levelProgress][1];
	}

}


function countEnemies()
{
	var numEnemies = 0;
	
	for (var enemy : GameObject in GameObject.FindGameObjectsWithTag("Enemy"))
	{
		numEnemies++;
	}
	
	return numEnemies;	
}