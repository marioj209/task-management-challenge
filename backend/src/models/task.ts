import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TaskAttributes {
  id: string; // Cambio a string
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimated_effort: number;
  parent_task_id: string | null; // Cambio a string
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: 'TODO' | 'IN_PROGRESS' | 'DONE';
  public urgency!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  public estimated_effort!: number;
  public parent_task_id!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Generación automática
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
      defaultValue: 'TODO',
    },
    urgency: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      defaultValue: 'MEDIUM',
    },
    estimated_effort: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 }
    },
    parent_task_id: {
      type: DataTypes.UUID, // Cambio a UUID
      allowNull: true,
      references: { model: 'tasks', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  { sequelize, tableName: 'tasks', timestamps: true }
);

Task.hasMany(Task, { as: 'subtasks', foreignKey: 'parent_task_id' });
Task.belongsTo(Task, { as: 'parent', foreignKey: 'parent_task_id' });