import { databases } from "@/appwrite"
import { Board, Column, TypedColumn } from "@/typings";
import { log } from "console";

export const getTodosGroupeByColumn = async () =>{
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    );
    //console.log(data);
    const todos = data.documents;
    console.log("data", data);
    const columns = todos.reduce((acc, todo) =>{
        if(!acc.get(todo.status)){
            console.log("todo-statut", todos);
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            });
        }
        let imageParsed;
        try {
        imageParsed = todo.image && JSON.parse(todo.image);
        } catch (error) {
        console.error('Error parsing todo.image:', error);
        // Handle the error, set a default value, or take appropriate action
        imageParsed = null; // or provide a default value
        }
        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            image: imageParsed,
        });
        
        return acc;
    }, new Map<TypedColumn, Column>);

    const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
    for (const columnType of columnTypes){
        if(!columns.get(columnType)){
            columns.set(columnType, {
              id: columnType,
              todos: [],
            })
        }
    }
    //sort columns by columns type 
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort((a,b) =>(
            columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        ))
    );
    const board: Board = {
        columns: sortedColumns
    }
 /*    todos.forEach(todo => {
        console.log("todo", todo);
        // ... reste de la logique de la boucle
      }); */
    return board;

};
