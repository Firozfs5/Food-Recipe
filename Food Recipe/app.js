//Landing Page
// https://youtu.be/Ro9i0OrcDgI?si=G6W4o7U5iRd2debW
let rl=document.querySelectorAll(".rl-pop")
let rlDialog=document.querySelector("#reglog")
let rlDialogcloseBtn=document.querySelector(".rlDialogClose")
let body=document.querySelector("body");


let inp=document.querySelector("#homepageSearch");
let searchBtn=document.querySelector("#searchBtn");
let foodResultName=document.querySelector("#foodResult");
let cardContainer=document.querySelector(".foodExamples");
let favouriteWindow=document.querySelector("#fav"); 


// Dialog for registration and login //
    rl.forEach((el)=>{
        el.addEventListener("click",()=>{
            rlDialog.showModal();
        
        })
    })

    rlDialogcloseBtn.addEventListener("click",()=>{
        rlDialog.close();
    }) 
//////////////


//api calling and returning Data
async function getRecipe(foodName) {
    let Data;
    try{
        const url=`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`
        Data=await axios.get(url);
        // console.log(Data);
        
    }
    catch(e){
        alert("sorry theres an error");
        
    }

    
    return Data.data;
}
//////////////

// home page cards

foodExamplesCardCreation();
async function foodExamplesCardCreation(){
    let foodExamplesCardArray=["noodles","curry","cake","soup","pasta","salad","Cabbage Soup (Shchi)","spaghetti","biryani","dal","Tarte Tatin","Cassoulet"];

    for(let ele of foodExamplesCardArray){
        // console.log(ele);
        let data=await getRecipe(ele)
        // console.log(data);
        
        let card=dynamicCard(data.meals[0])

        card.children[1].children[2].addEventListener("click",async(e)=>{

            // console.log("recipe clicked")

            let Name=e.target.parentElement.children[0];
            // console.log(Name.innerText);
    
            let recipe=await getRecipe(Name.innerText)

            
    
            createIntroCardView(recipe.meals[0]); 

               
        })
        
        cardContainer.append(card);


    }    


}



// card dialog content to load
let cards=document.querySelectorAll(".card div button");

for(let card of cards){
    ///clicking recipe button
    card.addEventListener("click",async(e)=>{

        console.log("recipe clicked");
        
        let Name=e.target.parentElement.children[0];
        console.log(Name.innerText);

        let recipe=await getRecipe(Name.innerText)

        
        createIntroCardView(recipe.meals[0]); 

           
    })
    
}
///////

// card view creation function
function createIntroCardView(data){

    console.log("in function");
    console.log(data);
    
    // 
    body.classList.add("stopscrollBackdrop");

    // 

    let cardDialog=document.createElement("dialog");
    cardDialog.classList.add("CardView","makingcvFlex");

    //*important */

    body.append(cardDialog);
    cardDialog.showModal();

    // 

    let foodImage=document.createElement("div");
    foodImage.classList.add("foodimage");


    let foodContent=document.createElement("div");
    foodContent.classList.add("foodContent");

    let foodHeading=document.createElement("h2");
    let ingredientsHeading=document.createElement("h4");
    let ingredients=document.createElement("ul");
    let instructionHeading=document.createElement("h4");
    let instruction=document.createElement("p");

    let ytBtn=document.createElement("a");
    ytBtn.classList.add("btn","btn-danger");
    ytBtn.innerText="YouTube"
    let sourceBtn=document.createElement('a');
    sourceBtn.classList.add("btn","btn-primary");
    sourceBtn.innerText="Source"
    ///
    let addToFav=document.createElement('button');
    addToFav.innerText="Fav";
    addToFav.style.marginRight="10px"
    addToFav.classList.add("favStyle","btn","btn-light");

    ///
    let closeCvBtn=document.createElement("button");
    closeCvBtn.innerText="close"
    closeCvBtn.classList.add("btn","btn-dark");

    // 
    cardDialog.classList.add("makingcvFlex")

    // 

    cardDialog.append(foodImage);
    cardDialog.append(foodContent);

    foodContent.append(foodHeading)
    foodContent.append(ingredientsHeading)
    foodContent.append(ingredients)
    foodContent.append(instructionHeading)
    foodContent.append(instruction)

    // buttons
    foodContent.append(ytBtn);
    foodContent.append(sourceBtn);
    foodContent.append(addToFav);
    foodContent.append(closeCvBtn);
    

//   entering data
    foodImage.style.background=`url('${data.strMealThumb}')`
    
    foodHeading.innerText=data.strMeal
    ingredientsHeading.innerText="Ingredients:"
    
    addIngredients(ingredients,data)

    instructionHeading.innerText="Instruction:"
    instruction.innerText=data.strInstructions;


    ytBtn.addEventListener("click",()=>{
        window.open(data.strYoutube, "_blank");

    })

    sourceBtn.addEventListener("click",()=>{
        window.open(data.strSource, "_blank");

    })

    closeCvBtn.addEventListener("click",()=>{

        body.classList.remove("stopscrollBackdrop");

        console.log("clicked");
        cardDialog.classList.remove("makingcvFlex");
        cardDialog.remove();
        cardDialog.close()

    })
    
    addToFav.addEventListener("click",()=>{
        console.log("clicked");

        let locStorage=JSON.parse(localStorage.getItem("favDishes"))||[];
        console.log(locStorage);

        if(!locStorage.includes(data.idMeal)){
            locStorage.unshift(data.idMeal);
            localStorage.setItem("favDishes",JSON.stringify(locStorage));

        }else{
            alert("already in favorites");
        }
        
    })




}
///////////////


// adding of ingredients inside dialog
function addIngredients(ingredients,data){
 
    for(let i=0;i<15;i++){
        let element=data[`strIngredient${i}`]
        if(element){

            let liTag=document.createElement("li");
            liTag.innerText=element;
            ingredients.append(liTag)
        }
    }

}
///////////////


// searching card implementation
// cardCreation dynamically

function dynamicCard(data){

   

    let cardBody=document.createElement("div");
    cardBody.classList.add("card");
    cardBody.style.width="18rem";

    let cardImg=document.createElement("img");
    cardImg.classList.add("card-img-top","landingImg");
    cardImg.setAttribute("src",data.strMealThumb)
    cardBody.append(cardImg);
    

    let cardDetails=document.createElement("div");
    cardDetails.classList.add("card-body");
    cardBody.append(cardDetails)

    let h5=document.createElement("h5");
    h5.classList.add("card-title");
    cardDetails.append(h5);
    h5.innerText=data.strMeal;

    let p=document.createElement("p");
    p.classList.add("card-text");
    cardDetails.append(p);
    p.innerText=data.strTags

    let btn=document.createElement("buttton");
    btn.classList.add("btn","btn-dark", "landingrecipe");
    cardDetails.append(btn);
    btn.innerText="View Recipe";

    let locStorage=JSON.parse(localStorage.getItem("favDishes"))||[];
    if(locStorage.includes(data.idMeal)){
       let favDelete=document.createElement("button");
       favDelete.innerText="Delete";
       favDelete.classList.add("btn","btn-dark");
       favDelete.style.marginLeft="10px";
       cardDetails.append(favDelete);

       favDelete.addEventListener("click",()=>{
       
        let currentAraay=JSON.parse(localStorage.getItem("favDishes"));
        let index=currentAraay.indexOf(data.idMeal);

        currentAraay.splice(index,1);
        localStorage.setItem("favDishes",JSON.stringify(currentAraay));
        cardContainer.removeChild(cardBody);


       })
    }



    return cardBody;

}
////////


//adding events on search and buttons
searchBtn.addEventListener("click",async()=>{
    let userInp=(inp.value).trim();
    inp.value="";

    foodResultName.innerText=`Result for ${userInp}`;

    let data=await getRecipe(userInp);
    console.log(data);

    cardContainer.innerText="";

    if(data.meals===null){
        foodResultName.innerText=`Sorry,couldn't find result for ${userInp}`

    }

    for(let eleCreate of data.meals){
 
        let element=dynamicCard(eleCreate,userInp);
        
        // 
        element.children[1].children[2].addEventListener("click",async(e)=>{

            console.log("recipe clicked")

            let Name=e.target.parentElement.children[0];
            console.log(Name.innerText);
    
            let recipe=await getRecipe(Name.innerText)

            
    
            createIntroCardView(recipe.meals[0]); 

               
        })

        // 

        cardContainer.append(element);

    }



    
})
////////


////////////////Favourites ////////////////////////////
favouriteWindow.addEventListener("click",async()=>{
    console.log("clicked");
    let locStorage=JSON.parse(localStorage.getItem("favDishes"))||[];

    if(locStorage.length===0){
        foodResultName.innerText="No favorites yet :(";
        cardContainer.innerText="";
    }else{
        foodResultName.innerText="Your Favorite Recipes";

        cardContainer.innerText="";

        for(let ele of locStorage){

        let Data=await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${ele}`);
        console.log(Data.data.meals[0]);

        let Element=dynamicCard(Data.data.meals[0],);

        cardContainer.append(Element);

        Element.children[1].children[2].addEventListener("click",async(e)=>{
            let Name=e.target.parentElement.children[0];
            let recipe=await getRecipe(Name.innerText);
            createIntroCardView(recipe.meals[0]);
        })



        }


        
    }
})



///////////////////////end/////////////////////////////





