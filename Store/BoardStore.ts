import {databases, ID, Storage} from "@/appwrite";
import { getTodosGroupeByColumn } from "@/lib/getTodosGroupeByColumn";
import {Board, Column, Image, Todo, TypedColumn} from "@/typings";
import create from "zustand";
import {images} from "next/dist/build/webpack/config/blocks/images";
import uploadImage from "@/lib/uploadImage";
import {json} from "stream/consumers";
import {state} from "sucrase/dist/types/parser/traverser/base";



interface BoardState {
  board: Board;

  getBoard: () => void;

  setBoardState: (board: Board) => void;

  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;

  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn)=>void;

  image: File | null;
  setImage: (image: File | null) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null)=>void;

  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  searchString: "",
  newTaskInput: "",
  newTaskType:"todo",
  image:null,

  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    const board = await getTodosGroupeByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    //delete todo from newColumn
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: {columns: newColumns}});

  /*   if(todo.image){
    await storage.deleteFile(todo.image.bucketId, todo.image.fileId)

    } */
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
    );
    
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input}),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId}),
  setImage: (image: File | null )=>set({image}),


  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) =>{
    let file: Image  | undefined;

    if(image) {
      const fileUploaded = await uploadImage(image);
      if(fileUploaded){
        file ={
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.fileId,
        }
      }
    }

    const {$id} =await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        ID.unique(),
        {
          title:todo,
          status:columnId,
          ...(file && {image : JSON.stringify(file)}),
        }
    );
    set({newTaskInput: ""});

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && {image: file})
      };
      const column = newColumns.get(columnId);
      if(!column){
        newColumns.set(columnId,{
          id: columnId,
          todos:[newTodo],
        });
      }else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return{
        board: {
          columns: newColumns,
        }
      }
    })

  }


}));
