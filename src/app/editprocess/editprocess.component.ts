import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservices.service';
import { Process } from '../_models/Process';
import { NgForm, FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from '../_services';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'basic-table',
  templateUrl: './editprocess.component.html',
  //styleUrls: ['./addproduct.component.scss']
})
export class EditprocessComponent implements OnInit {
  elements: any = [];
  survey: FormGroup;
  headElements = ['ID', 'Name', 'Status', 'Action'];
  //listChar2:ProductChar1[]=[];
  loading:string="Loading wait......"
  serverresponse:string='';
  serverError:number=0;
  oldSurveryData:any=[];
  oldId:any='';
  paramProductBody=new Process();
  constructor(public commonservice: CommonServiceService, private alertService: AlertService, private formBuilder: FormBuilder ,private route: ActivatedRoute) {

    Window["myComponent"] = this;


   }
   test(){
     //alert('hi')
     var ddd=$("customFormAdd")
    //console.log("testing");
    this.submitAddProduct();
  }

  
  f: NgForm;
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      //console.log(params['params']["id"]);
      this.oldId=params['params']["id"];      
      this.getProcessId();
    });
    
   
    //this.paramProductBody.Id=0;
  } 

  getProcessId(){
    this.commonservice.getProcessid(this.oldId).subscribe(
      dataList => {
        dataList=JSON.parse(dataList);
        this.oldSurveryData=dataList;
         this.survey = this.formBuilder.group({      
      sections: this.formBuilder.array([
        this.initSection(),
      ]),
    });
       
      },
      err => console.log(err)
    );
  }

  updateStatus(id,status){
    if(confirm("Are you sure to  "+status)) {      
      
      this.commonservice.updatePrcoessStatus({'status':status,'id':id}).subscribe(
        dataList => {
         
          //console.log(dataList.message);
          this.serverresponse=dataList.message;
          if(dataList.error==0){
            //this.getProcess()
            //this.paramProductBody.MachineName=""
          }
          //product.reset()
           // this.alertService.success("Add Product");
  
         
        },
        err => console.log(err)
      );
    }

  }

  submitAddProduct(){ 
    console.log(this.survey.value);
    
    this.commonservice.addFamily(this.paramProductBody).subscribe(
      dataList => {
       
        //console.log(dataList.message);
        this.serverresponse=dataList.message;
        if(dataList.error==0){
          //this.getProcess()
          //this.paramProductBody.MachineName=""
        }
        //product.reset()
         // this.alertService.success("Add Product");

       
      },
      err => console.log(err)
    );
   
    
    
  }

    
  initSection() {  
    var extrafiled=JSON.parse(this.oldSurveryData['result']['EXTRAFIELDS'])  
    console.log(extrafiled['sections'][0]['questions']);
    var tempquestions=[];
    for(var i=0;i<extrafiled['sections'][0]['questions'].length;i++){
      tempquestions[i]=this.initQuestionN(extrafiled['sections'][0]['questions'][i])
    }
    return this.formBuilder.group({
      MachineName:this.oldSurveryData['result']["MachineName"],
      oldId:this.oldId,
      sectionTitle: [''],
      sectionDescription: [''],      
      questions: this.formBuilder.array(tempquestions)
    });
  }
  initQuestionN(qestions) {
    
    var tempquestions=[];
    for(var i=0;i<qestions['options'].length;i++){
      tempquestions[i]=this.initOptionsN(qestions['options'][i])
    }

    return this.formBuilder.group({
      questionTitle: [qestions.questionTitle],
      questionType: [qestions.questionType],
      options: new FormArray(tempquestions)
    });
  }

  initOptionsN(options) {
    return this.formBuilder.group({
      optionTitle: [options.optionTitle]
    });
  }

  initQuestionD() {
    return this.formBuilder.group({
      questionTitle: [],
      questionType: ["Free Text"],
      options: new FormArray([
        this.initOptions()
      ])
    });
  }

  initOptions() {
    return this.formBuilder.group({
      optionTitle: ['']
    });
  }


  addSection() {
    const control = <FormArray>this.survey.get('sections');
    control.push(this.initSection());
  }

  addQuestion(j) {
    console.log(j);
    const control = <FormArray>this.survey.get('sections')['controls'][j].get('questions');
   // console.log(control);
    control.push(this.initQuestionD());
    
  }

  add(i,j) {
    //console.log(k);
    const control = <FormArray>this.survey.get('sections')['controls'][i].get('questions').controls[j].get('options');

  // const control = <FormArray>this.survey.get(['sections',0,'questions',k,'options']); // also try this new syntax
    //console.log(control);
    control.push(this.initOptions());
  }

  getSections(form) {
    //console.log(form.get('sections').controls);
    return form.controls.sections.controls;
  }
  getQuestions(form) {
   //console.log(form.controls.questions.controls);
    return form.controls.questions.controls;
  }
  getOptions(form) {
    //console.log(form.get('options').controls);
    return form.controls.options.controls;

  }

  removeQuestion(j){
     const control = <FormArray>this.survey.get('sections')['controls'][j].get('questions');
     control.removeAt(j);
  }

  removeSection(i){
   const control = <FormArray>this.survey.get('sections');
   control.removeAt(i);

  }

  removeOption(i,j){
   const control = <FormArray>this.survey.get(['sections',i,'questions',j,'options']); // also try this new syntax
   control.removeAt(i);

  }

  getCurrentFieldType(i,j){
    
    const control = <FormArray>this.survey.get('sections')['controls'][i].get('questions');    
    return control.value[j].questionType;
  }

  onSubmit(form){
    //var json = JSON.stringify(form.value);
    this.commonservice.processUpdate(form.value).subscribe(
      dataList => {
       
        //console.log(dataList.message);
        this.serverresponse=dataList.message;
        this.serverError=dataList.error;
        if(dataList.error==0){
          //this.getProcess()
          //this.paramProductBody.MachineName=""
        }
        //product.reset()
         // this.alertService.success("Add Product");

       
      },
      err => console.log(err)
    );
    console.log(form.value);
  }
  

}
