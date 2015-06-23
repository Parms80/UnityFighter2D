var target : Transform;
var distance = 3.0;
var height = 3.0;
var damping = 5.0;
var smoothRotation = true;
var rotationDamping = 10.0;
var lockRotation : boolean;
var follow : boolean;
var lockHeight : boolean;

function Start()
{
	follow = true;
}

function Update () {

	var wantedPosition = target.TransformPoint(0, height, -distance);
		
	if (!follow)
	{
		// Only stop the horizontal scrolling
		wantedPosition.x = transform.position.x;
	}
	
	transform.position = Vector3.Lerp (transform.position, wantedPosition, Time.deltaTime * damping);
	
	if (lockHeight)
	{
		transform.position.y = height;
	}

	if (smoothRotation) {
		var wantedRotation = Quaternion.LookRotation(target.position - transform.position, target.up);
		transform.rotation = Quaternion.Slerp (transform.rotation, wantedRotation, Time.deltaTime * rotationDamping);
	}
	else
	{
		transform.LookAt (target, target.up);
	}
	

	if (lockRotation)
	{
		transform.localRotation = Quaternion.EulerAngles(0,0,0);
	}	
}

function SetFollow(flag)
{
	follow = flag;
}