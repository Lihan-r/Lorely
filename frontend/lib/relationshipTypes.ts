/**
 * Common relationship types for worldbuilding connections.
 * These are suggestions - users can create custom types as strings.
 */

export const RELATIONSHIP_TYPES = {
  // Character relationships
  PARENT_OF: 'PARENT_OF',
  CHILD_OF: 'CHILD_OF',
  SIBLING_OF: 'SIBLING_OF',
  SPOUSE_OF: 'SPOUSE_OF',
  FRIEND_OF: 'FRIEND_OF',
  ENEMY_OF: 'ENEMY_OF',
  MENTOR_OF: 'MENTOR_OF',
  STUDENT_OF: 'STUDENT_OF',

  // Faction/Organization relationships
  MEMBER_OF: 'MEMBER_OF',
  LEADER_OF: 'LEADER_OF',
  ALLIED_WITH: 'ALLIED_WITH',
  RIVAL_OF: 'RIVAL_OF',

  // Location relationships
  LOCATED_IN: 'LOCATED_IN',
  BORN_IN: 'BORN_IN',
  DIED_IN: 'DIED_IN',
  RULES: 'RULES',

  // Event relationships
  PARTICIPATED_IN: 'PARTICIPATED_IN',
  CAUSED: 'CAUSED',
  WITNESSED: 'WITNESSED',

  // Item relationships
  OWNS: 'OWNS',
  CREATED: 'CREATED',
  USES: 'USES',

  // Generic relationships
  RELATED_TO: 'RELATED_TO',
  MENTIONED_IN: 'MENTIONED_IN',
} as const;

export type RelationshipType = typeof RELATIONSHIP_TYPES[keyof typeof RELATIONSHIP_TYPES];

// Human-readable labels for relationship types
export const RELATIONSHIP_LABELS: Record<string, string> = {
  PARENT_OF: 'Parent of',
  CHILD_OF: 'Child of',
  SIBLING_OF: 'Sibling of',
  SPOUSE_OF: 'Spouse of',
  FRIEND_OF: 'Friend of',
  ENEMY_OF: 'Enemy of',
  MENTOR_OF: 'Mentor of',
  STUDENT_OF: 'Student of',
  MEMBER_OF: 'Member of',
  LEADER_OF: 'Leader of',
  ALLIED_WITH: 'Allied with',
  RIVAL_OF: 'Rival of',
  LOCATED_IN: 'Located in',
  BORN_IN: 'Born in',
  DIED_IN: 'Died in',
  RULES: 'Rules',
  PARTICIPATED_IN: 'Participated in',
  CAUSED: 'Caused',
  WITNESSED: 'Witnessed',
  OWNS: 'Owns',
  CREATED: 'Created',
  USES: 'Uses',
  RELATED_TO: 'Related to',
  MENTIONED_IN: 'Mentioned in',
};

// Group relationship types by category for UI
export const RELATIONSHIP_CATEGORIES = {
  Character: ['PARENT_OF', 'CHILD_OF', 'SIBLING_OF', 'SPOUSE_OF', 'FRIEND_OF', 'ENEMY_OF', 'MENTOR_OF', 'STUDENT_OF'],
  Organization: ['MEMBER_OF', 'LEADER_OF', 'ALLIED_WITH', 'RIVAL_OF'],
  Location: ['LOCATED_IN', 'BORN_IN', 'DIED_IN', 'RULES'],
  Event: ['PARTICIPATED_IN', 'CAUSED', 'WITNESSED'],
  Item: ['OWNS', 'CREATED', 'USES'],
  Generic: ['RELATED_TO', 'MENTIONED_IN'],
};

export function getRelationshipLabel(type: string): string {
  return RELATIONSHIP_LABELS[type] || type.replace(/_/g, ' ').toLowerCase();
}
