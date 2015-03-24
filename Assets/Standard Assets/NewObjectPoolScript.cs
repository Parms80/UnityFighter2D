using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class NewObjectPoolScript : MonoBehaviour {

	public static NewObjectPoolScript current;
	public List<GameObject> pooledObjectTypes;
	public int pooledAmount = 10;
	public bool willGrow = true;
	List<List<GameObject>> pooledObjects;

	void Awake()
	{
		current = this;
		pooledObjects = new List<List<GameObject>> ();

		foreach (GameObject poolObj in pooledObjectTypes)
		{
			List<GameObject> enemyTypeList = new List<GameObject>();

			Debug.Log("Start: poolObj = "+poolObj);
			for (int i = 0; i < pooledAmount; i++)
			{
				GameObject obj = (GameObject)Instantiate(poolObj);
				obj.SetActive (false);
				enemyTypeList.Add (obj);
			}
			pooledObjects.Add (enemyTypeList);
		}
	}

	void Start () 
	{
	}

	public GameObject GetPooledObject(int objectType)
	{
		for (int i = 0; i < pooledObjects[objectType].Count; i++)
		{
			if (!pooledObjects[objectType][i].activeInHierarchy)
			{
				return pooledObjects[objectType][i];
			}
		}

		if (willGrow)
		{
			GameObject obj = (GameObject)Instantiate(pooledObjectTypes[objectType]);
			pooledObjects[objectType].Add(obj);

			return obj;
		}

		return null;
	}
}
