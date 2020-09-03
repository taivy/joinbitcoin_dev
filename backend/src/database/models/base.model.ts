import { Model } from 'objection';

export class BaseModel extends Model {
  readonly id: string;
  static readonly upsertColumn: string;

  static upsert(data: Partial<BaseModel>, updateData: Partial<BaseModel>) {
    let table = this.tableName;
    if (!updateData) updateData = data;
    console.log("updateData", updateData)
    var insert = this.query().insert(data).toString();
    let update = this.query().update(updateData).toString().replace(/^update .* set /i, '')
    console.log("update", update)
    let query = (insert + ' ON CONFLICT (' + this.upsertColumn +') DO UPDATE SET ' + update).replace(/returning \"id\"/i, '').replace(/;/i, '');
    query += ' returning id;';
    return this.raw(query);
  }
}
