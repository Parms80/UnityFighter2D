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


function spawnEnemies()
{
	switch (levelProgress)
	{
		case 1:
			Instantiate(Resources.Load("Linda"), Vector3(11.0, 0.0, 0.0), Quaternion.identity);
			Instantiate(Resources.Load("Abobo"), Vector3(13.5, 0.0, 3.7), Quaternion.identity);
		break;
		
		case 2:
			Instantiate(Resources.Load("AboboBoss"), Vector3(50.0, 0.0, 0.0), Quaternion.identity);
			Instantiate(Resources.Load("Williams"), Vector3(45.0, 0.0, 3.0), Quaternion.identity);
			Instantiate(Resources.Load("Roper"), Vector3(30.0, 0.0, 0.0), Quaternion.identity);
		break;
	}
}
