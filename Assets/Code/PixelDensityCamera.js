#pragma strict

var pixelsToUnits = 16;

function Start () {

}

function Update () {
	camera.orthographicSize = Screen.height / pixelsToUnits / 2;
}