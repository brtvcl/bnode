//Cutscene editor js

document.getElementById("addNode").addEventListener("click",addDefaultInput);

let indexes =  [];
let performs = [];
let args = [];
let speaks = [];
let answers = [];


//---------------------------------------
//INDEX INPUT START
//--------------------------------------

//Speak input object
function Speak(_id, parent_node_id, value)
{
    //Constructors
    this._id = "speak"+_id;
    this.parent_node_id = parent_node_id;
    this.value = value;

    //DOM Element create
    let newSpeakInput = document.createElement("input");
    newSpeakInput.setAttribute("type","text");
    newSpeakInput.setAttribute("id",this._id);

    //addEventListener so When input entered update value 
    newSpeakInput.addEventListener("change",function(){
         speaks[_id].value = newSpeakInput.value; 
         console.log("value in speaks["+_id+"] updated as '"+speaks[_id].value+"'");
         console.log(speaks);
        });

    //Append to parent node
    document.getElementById(parent_node_id).appendChild(newSpeakInput);
}

//Perform input object
function Perform(_id, parent_node_id, value)
{
    this._id = "perform"+_id;
    this.parent_node_id = parent_node_id;
    this.value = value;
    
    let newPerformInput = document.createElement("select");
    newPerformInput.setAttribute("id",this._id);

    document.getElementById(parent_node_id).appendChild(newPerformInput); 

    let newPerformOption = document.createElement("option");
    newPerformOption.setAttribute("value","perform1");
    newPerformOption.innerHTML = "perform1";
    newPerformInput.appendChild(newPerformOption); 

    newPerformOption = document.createElement("option");
    newPerformOption.setAttribute("value","perform1");
    newPerformOption.innerHTML = "perform2";
    newPerformInput.appendChild(newPerformOption);
    
    
    for (let repeat = 0; repeat < 5; repeat++) 
    {
        for (let i = 0; i <= args.length; i++) 
        {
            if (args[i]==undefined || args[i]._id == "empty")
            {
                args[i] = new Arg(i, _id, parent_node_id, repeat, "");
                break;
            }
        }    
    }  
    
    console.log(args);


}

function Arg(_id,parent_perform_index,parent_node_id,arg_number,value)
{
    this._id = "argument"+_id;
    this.parent_perform_index = parent_perform_index;
    this.arg_number = arg_number;
    this.value = value;

    //DOM Element Create
    let new_arg_input = document.createElement("input");
    new_arg_input.setAttribute("type","text");
    new_arg_input.setAttribute("id",this._id);
    new_arg_input.setAttribute("value",this.value);

    //Add event listener to update value in array
    new_arg_input.addEventListener("change",function(){
        args[_id].value = new_arg_input.value; 
        console.log("value in args["+_id+"] updated as '"+args[_id].value+"'");
        console.log(args);
       });

    //Append to parent node
    document.getElementById(parent_node_id).appendChild(new_arg_input);

}
//--------------------------------------
//Index input object
function Index(_id, parent_node_id, value)
{
    //Constructors
    this._id = "index"+_id;
    this.parent_node_id = parent_node_id;
    this.value = value;

    //DOM Element
    let newIndexInput = document.createElement("input");
    newIndexInput.setAttribute("type","number");
    newIndexInput.setAttribute("id",this._id);
    newIndexInput.setAttribute("value",value);

    //addEventListener so When input entered update value 
    newIndexInput.addEventListener("change",function(){
    indexes[_id].value = newIndexInput.value; 
    console.log("value in indexes["+_id+"] updated as '"+indexes[_id].value+"'");
    console.log(indexes);
    });
    
    //Appent to node
    document.getElementById(parent_node_id).appendChild(newIndexInput);    

}

function Answer(_id,parent_node_id)
{
    ///Constructors
    this._id = "answer"+_id;
    this.parent_node_id = parent_node_id;

    //DOM Element create
    let newAnswerInput = document.createElement("div");
    newAnswerInput.setAttribute("class","answer");
    newAnswerInput.setAttribute("id",this._id);

    //Appent to parent node
    document.getElementById(parent_node_id).appendChild(newAnswerInput);
    newAnswerInput.appendChild(document.createElement("hr"));


    //Text
    /*
    let count = 0;
    for (let i = 0; i < answers.length; i++) 
    {
        if (answers[i].parent_node_id == parent_node_id)
        {count++;}
        
    }
    */

    for (let i = 0; i <= speaks.length; i++) 
    {
        if (speaks[i]==undefined || speaks[i]._id=="empty")
        {
            speaks[i] = new Speak(i, this._id, "");
            break;
        }   
    }
    

}
//Removing the default inputs
//!!!!Add removal of event listener in future
function removeDefaultInput(i)
{
    console.log("deleted : indexes["+ i+"]" );
    console.log( indexes );
    console.log( speaks );
    console.log( performs );  
    
    indexes[i]._id            = "empty";
    indexes[i].parent_node_id = "empty";
    indexes[i].value          = "empty";
    
    speaks[i]._id             = "empty";
    speaks[i].parent_node_id  = "empty";
    speaks[i].value           = "empty";   
    
    performs[i]._id           = "empty";
    performs[i].parent_node_id= "empty";
    performs[i].value         = "empty";
    

}

//Perform Script add button
//Adds a button element
//When clicked the added button, it creates the perform input and creates "delete button" of perform input


//-----------
//PERFORM ELEMENT
{
    function add_perform_button(parent_id)
    {
        //Create button
        let perform_add_btn = document.createElement("button");
        perform_add_btn.innerHTML = "+";
        
        //Set unique id for button
        let id_name = "perform_add_btn";
        let btn_index = 0;
        //Check how many buttons present on DOM
        while (!!document.getElementById("perform_add_btn"+btn_index)) {
            btn_index++;
        }
        perform_add_btn.setAttribute("id",id_name+btn_index);
        
        //Append button to DOM
        document.getElementById(parent_id).appendChild(perform_add_btn);

        //Add EventListener
        perform_add_btn.addEventListener("click", add_perform_input.bind(null, parent_id, id_name+btn_index));
        
    }
    //Function of the "add perform script" button
    //Adds the new perform input
    //Removes the button
    function add_perform_input(parent_id, button_id)
    {
        let perform_index = 0;

        //Add perform to empty array index
        while (perform_index <= performs.length) {
            if ( performs[perform_index]==undefined || performs[perform_index]._id == "empty") 
            {
                performs[perform_index] = new Perform(perform_index,parent_id,0);
                break;
            }
            perform_index++;
        }


        //Perform Script del button
        let prf_del_btn = document.createElement("button");
        prf_del_btn.setAttribute("id","prf_del_btn"+perform_index);
        prf_del_btn.innerHTML = "X";
        prf_del_btn.addEventListener("click", del_perform_input.bind(null, parent_id, perform_index));
        document.getElementById(parent_id).appendChild(prf_del_btn);

        //Remvoe "add '+' " button
        document.getElementById(button_id).remove();

        console.log(performs);

    }

    //Deletes the perform input element and delets data in the performs[] array 
    function del_perform_input(parent_id, perform_index)
    {
        console.log(perform_index);
        for (let i = 0; i <= args.length; i++) 
        {
            if ( args[i]!=undefined && args[i]!="empty" && args[i].parent_perform_index==perform_index)
            {
                document.getElementById(args[i]._id).remove();
                args[i]._id = "empty";
                args[i].parent_perform_index = "empty";
                args[i].arg_number = "empty";
                args[i].value = "empty";
            }
        }

        document.getElementById("prf_del_btn"+perform_index).remove();
        document.getElementById("perform"+perform_index).remove();

        performs[perform_index]._id = "empty";
        performs[perform_index].parent_node_id = "empty";
        performs[perform_index].value = "empty";


        add_perform_button(parent_id);
        console.log(performs);
        console.log(args);
    }
}


//--------------
//ANSWER ELEMENT
{

    //Add answer button
    function add_answer_button(parent_id)
    {
        //Create button
        let answer_add_btn = document.createElement("button");
        answer_add_btn.innerHTML = "answer add";
        
        //Set id for button 
        let id_name = "answer_add_btn";
        let btn_index=0;
        //Check how many buttons present on DOM
        while (!!document.getElementById("answer_add_btn"+btn_index)) {
            btn_index++;
        }
        answer_add_btn.setAttribute("id",id_name+btn_index);

        //Append button to DOM
        document.getElementById(parent_id).appendChild(answer_add_btn);
        
        //Add event listener
        answer_add_btn.addEventListener("click",add_answer_input.bind(null, parent_id, id_name+btn_index));
        
        
    }

    function add_answer_input(parent_id, button_id)
    {
    
        //Remove add button that called this function 
        //document.getElementById(button_id).remove();

        //let parent_node_id = nodes[parent_node_index]._id;
        
        //Check how many answers this parent_node has
        let count = 0;
        for (let i = 0; i <= answers.length; i++) 
        {
            if (answers[i]!=undefined && answers[i].parent_node_id == parent_id)
            {count++;}
            
        }
        //If less than 4 add new answer
        if (count<4)
        {
            let answer_index = 0;
            while (answer_index <= answers.length) {
                if (answers[answer_index]==undefined || answers[answer_index]._id=="empty")
                {
                    answers[answer_index] = new Answer(answer_index,parent_id);
                    
                    //Add answer perform button
                    add_perform_button("answer"+answer_index);
                    
                    break;
                }
                answer_index++;
            }

            //Add delete button
            let answ_del_btn = document.createElement("button");
            answ_del_btn.innerHTML = "X";
            answ_del_btn.setAttribute("id","answ_del_btn"+answer_index);
            answ_del_btn.addEventListener("click",del_answer_input.bind(null,parent_id,answer_index));
            document.getElementById(parent_id).appendChild(answ_del_btn);
            
        }

        
        
    }

    function del_answer_input(parent_id, answer_index)
    {

        //Remove array list here!!
        
        answers[answer_index].parent_node_id = "empty";
        answers[answer_index]._id = "empty";
        console.log(answers);

        //Remove answer elements
        document.getElementById("answer"+answer_index).remove();

        //Add add button
        /*
        add_answer_button(parent_node_index,answer_index);
        */

        //Remove delete button
        document.getElementById("answ_del_btn"+answer_index).remove();
        
    }

}

//Adding the default inputs and appending it to node
function addDefaultInput()
{
    /*This function searches all the 
    nodes and finds the new added one to the workspace
    And adds the default inputs to the node*/

    console.log(indexes);
    console.log("Yeni i inputu ekleniyor..");

    //Search in all nodes
    for (let i = 0; i <= nodes.length; i++) 
    {
        //Skip the undefined or "empty" (deleted) nodes
        if (nodes[i]!=undefined && nodes[i]._id != "empty")
        {
            console.log("Checking if this "+nodes[i]._id+" has any inputs");
            //Search in all index inputs
            for (let j = 0; j <= indexes.length; j++) 
            {
                /*Check if index input is available (not "empty" or undefined), 
                and check if this input's parent is the node that we are searching for
                IF YES that means that means this node isn't the one we are looking for
                (we are looking for a node that has no input so we can add the input)
                IF NOT and also if we checked all the indexes this means 
                we found the node that has no index input 
                */

                //Checking if this indexes parent is the node we are in
                if ( (indexes[j] != undefined && indexes[j]._id != "empty" ) && indexes[j].parent_node_id == nodes[i]._id)
                {
                    console.log(nodes[i]._id +" and "+ indexes[j]._id+" is connected");
                    break;
                }
                //IF NOT, check if we checked all the index inputs
                else if ( j==indexes.length )
                {
                    /*Search in all indexes, so we can 
                    insert the new one if theres an "empty" one
                    other just add new one
                    */
                    for (let k = 0; k <= indexes.length; k++) 
                    {
                        //If found "empty" or undefined(new slot) add the inputs there
                        if (indexes[k]==undefined || indexes[k]._id == "empty")
                        {
                            //Create default inputs
                            indexes[k] = new Index(k, nodes[i]._id, k);
                            speaks[k] = new Speak(k,nodes[i]._id, "");

                            console.log(answers);
                            add_answer_button(nodes[i]._id);
                            add_perform_button(nodes[i]._id);
                            
                            //------------------------------------------------
                            //Silme butonunu bul
                            delid = nodes[i]._id.slice(4,8);
                            delelement = document.getElementById("del"+delid);
                            //Veriyi silmek için delete butonuna Event listener ekle
                            document.getElementById("del"+delid).addEventListener("click", removeDefaultInput.bind(null,k) );

                            break;
                        }
                    }

                    //TERMINATE ALL THE LOOPS!!
                    /*This sets the variable 
                    of the first loop to out of range
                    so all the loops STOPS  */
                    i=nodes.length+1;
                    
                    console.log(indexes);
                    break;
                }
                
            }
        }
        
    }
    
}

//---------------------------------------
//INDEX INPUT END
//---------------------------------------

