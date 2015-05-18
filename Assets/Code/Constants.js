#pragma strict

public static var PLAYER_STANDING = 0;
public static var PLAYER_WALKING = 1;
public static var PLAYER_PUNCHING = 2;
public static var PLAYER_PUNCHING_2 = 3;
public static var PLAYER_KICKING = 4;
public static var PLAYER_JUMPING = 5;
public static var PLAYER_FLYING_KICK = 6;
public static var PLAYER_FALLING = 7;
public static var PLAYER_HIT = 8;
public static var PLAYER_DOWN = 9;

public static var ENEMY_IDLE = 0;
public static var ENEMY_WALKING = 1;
public static var ENEMY_PUNCHING = 2;
public static var ENEMY_PUNCHING_2 = 3;
public static var ENEMY_KICKING = 4;
public static var ENEMY_JUMPING = 5;
public static var ENEMY_HIT = 6;
public static var ENEMY_FALLING = 7;
public static var ENEMY_DOWN = 8;
public static var ENEMY_WALKING_BACK = 9;
public static var ENEMY_FLYING_KICK = 10;

public static var ATTACK_NONE = 0;
public static var ATTACK_JAB = 1;
public static var ATTACK_CROSS = 2;
public static var ATTACK_KICK = 3;

public static var COMBO_RESET_TIME = 0.5f;
public static var PLAYER_DOWN_TIME = 1.0f;
public static var PLAYER_STUN_TIME = 0.1f;
public static var ENEMY_STUN_TIME = 0.1f;
public static var ENEMY_DOWN_TIME = 1.0f;
public static var LAST_HIT_TIME = 0.5f;

public static var FREEZE_TIME = 0.5f;

public static var WALK_BACK_DISTANCE = 4.0f;

public static var KNOCK_BACK_FORCE = 1000.0f;
public static var KNOCK_BACK_FORCE_DEAD = 1500.0f;
public static var KNOCK_BACK_FORCE_Y = 0.03f;
public static var FLY_KICK_VELOCITY_X = 1000.0f;

public static var PUNCH_DISTANCE = 1.5f;

public static var PLAYER_FLY_KICK_DAMAGE = 10;
public static var PLAYER_ATTACK_DAMAGE = 10;
public static var ENEMY_FLY_KICK_DAMAGE = 10;
public static var ENEMY_ATTACK_DAMAGE = 10;
