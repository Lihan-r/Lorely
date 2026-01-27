package com.lorely.model;

/**
 * Common relationship types for worldbuilding connections.
 * These are suggestions - users can create custom types as strings.
 */
public final class RelationType {

    // Character relationships
    public static final String PARENT_OF = "PARENT_OF";
    public static final String CHILD_OF = "CHILD_OF";
    public static final String SIBLING_OF = "SIBLING_OF";
    public static final String SPOUSE_OF = "SPOUSE_OF";
    public static final String FRIEND_OF = "FRIEND_OF";
    public static final String ENEMY_OF = "ENEMY_OF";
    public static final String MENTOR_OF = "MENTOR_OF";
    public static final String STUDENT_OF = "STUDENT_OF";

    // Faction/Organization relationships
    public static final String MEMBER_OF = "MEMBER_OF";
    public static final String LEADER_OF = "LEADER_OF";
    public static final String ALLIED_WITH = "ALLIED_WITH";
    public static final String RIVAL_OF = "RIVAL_OF";

    // Location relationships
    public static final String LOCATED_IN = "LOCATED_IN";
    public static final String BORN_IN = "BORN_IN";
    public static final String DIED_IN = "DIED_IN";
    public static final String RULES = "RULES";

    // Event relationships
    public static final String PARTICIPATED_IN = "PARTICIPATED_IN";
    public static final String CAUSED = "CAUSED";
    public static final String WITNESSED = "WITNESSED";

    // Item relationships
    public static final String OWNS = "OWNS";
    public static final String CREATED = "CREATED";
    public static final String USES = "USES";

    // Generic relationships
    public static final String RELATED_TO = "RELATED_TO";
    public static final String MENTIONED_IN = "MENTIONED_IN";

    private RelationType() {
        // Prevent instantiation
    }
}
