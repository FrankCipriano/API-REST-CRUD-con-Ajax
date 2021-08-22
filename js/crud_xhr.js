const d=document,
      $table=d.querySelector(`.tabla`),
      $form=d.querySelector(`.formulario`),
      $h1_title=d.querySelector(`.titulo`),
      $plantilla=d.getElementById(`plantilla`).content,
      $fragmento=d.createDocumentFragment()

//-FUNCION GENERICO PARA USARLO EN CUALQUIER PETICION HTTP
const ajax=(opciones)=>{
    let {url,metodo,exito,error,dato}=opciones
    const xhr=new XMLHttpRequest()
    xhr.addEventListener(`readystatechange`,(e)=>{
        if(xhr.readyState!==4)  return
        if(xhr.status>=200 && xhr.status<300){
            let dato_JSON=JSON.parse(xhr.responseText)
            exito(dato_JSON)
        }else{
            let mensaje=xhr.statusText || `Ocurio un error`
            error(`Error ${xhr.status}: ${mensaje}`)
        }
    })
    xhr.open(metodo || `GET`,url)
    xhr.setRequestHeader(`Content-type`,`application/json; charset=utf-8`)
    xhr.send(JSON.stringify(dato))
}
//-METODO DE PETICION GET CON XMLHTTPREQUEST
const getAjax=()=>{
    ajax({
        url:`http://127.0.0.1:3000/lenguajes`,
        exito:(datos)=>{
            datos.forEach((dato)=>{
                $plantilla.querySelector(`.tecnologia`).textContent=dato.tecnologia
                $plantilla.querySelector(`.stack`).textContent=dato.stack
                $plantilla.querySelector(`.editar`).dataset.id=dato.id
                $plantilla.querySelector(`.editar`).dataset.tecnologia=dato.tecnologia
                $plantilla.querySelector(`.editar`).dataset.stack=dato.stack
                $plantilla.querySelector(`.eliminar`).dataset.id=dato.id
                
                let $clon=d.importNode($plantilla,true)
                $fragmento.appendChild($clon)
            })
            $table.querySelector(`tbody`).appendChild($fragmento)
        },
        error:(er)=>{
            $table.insertAdjacentHTML(`afterend`,`<p><b>${er}</b></p>`)
        }
    })
}

d.addEventListener(`DOMContentLoades`,getAjax())

//-METODO DE PETICION POST, PUT Y DELETE CON XMLHTTPREQUEST
d.addEventListener(`submit`,(e)=>{
    if(e.target===$form){
        e.preventDefault()
        if(!e.target.id.value){
            //-POST
            ajax({
                url:`http://127.0.0.1:3000/lenguajes`,
                metodo:`POST`,
                exito:(datos)=>location.reload(),
                error:(er)=>$form.insertAdjacentHTML(`afterend`,`<p><b>${er}</b></p>`),
                dato:{
                    tecnologia:e.target.tecnologia.value,
                    stack:e.target.stack.value
                }
            })
        }else{
            //PUT
            ajax({
                url:`http://127.0.0.1:3000/lenguajes/${e.target.id.value}`,
                metodo:`PUT`,
                exito:(datos)=>location.reload(),
                error:(er)=>$form.insertAdjacentHTML(`afterend`,`<p><b>${er}</p></b>`),
                dato:{
                    tecnologia:e.target.tecnologia.value,
                    stack:e.target.stack.value
                }
            })
        }
    }
})
d.addEventListener(`click`,(e)=>{
    if(e.target.matches(`.editar`)){
        $h1_title.textContent=`EDITAR TECNOLOGIA`
        $form.tecnologia.value=e.target.dataset.tecnologia
        $form.stack.value=e.target.dataset.stack
        $form.id.value=e.target.dataset.id
    }
    if(e.target.matches(`.eliminar`)){
        let respuesta=confirm(`Seguro que deseas eliminar ${e.target.dataset.id}?`)
        if(respuesta){
            //-DELETE
            ajax({
                url:`http://127.0.0.1:3000/lenguajes/${e.target.dataset.id}`,
                metodo:`DELETE`,
                exito:(dato)=>location.reload(),
                error:(er)=>alert(er)
            })
        }
    }
})