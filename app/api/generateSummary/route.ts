import { log } from "console";



export async function POST(request:Request) {

    const {todos} = await request.json();
    console.log(todos);
    
    //communicate with openAI GPT
}