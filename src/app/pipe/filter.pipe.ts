import { Pipe, PipeTransform } from '@angular/core';
import { identifierModuleUrl } from '@angular/compiler';

/* tslint:disable */ 

@Pipe({
  name: 'filtermulti'
})
export class FiltermultiPipe implements PipeTransform {
  transform(myobjects: Array<object>, args?: Array<object>): any {

    if (args && Array.isArray(myobjects)) {
      // copy all objects of original array into new array of objects
      var returnobjects = myobjects;
      // args are the compare oprators provided in the *ngFor directive
      args.forEach(function (filterobj) {
        let filterkey = Object.keys(filterobj)[0];

        let filtervalue = filterobj[filterkey];

        myobjects.forEach(function (objectToFilter) {
          if (objectToFilter[filterkey] != filtervalue && filtervalue != "") {
            // object didn't match a filter value so remove it from array via filter
            returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
          }
        })
      });
      // return new object to *ngFor directive
      return returnobjects;
    }
  }
}

