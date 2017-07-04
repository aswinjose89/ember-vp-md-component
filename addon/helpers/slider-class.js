import Ember from 'ember';

export function sliderClass(params/*, hash*/) {
    var fileIndex = params[0];
    var currentIndex = params[1];
    var result = " _";
    if(fileIndex===(currentIndex-1)){
        result="swiper-slide-prev";
    }else if(fileIndex===currentIndex) {
        result="swiper-slide-active";
    }else if(fileIndex===(currentIndex+1)) {
        result="swiper-slide-next";
    }
  return result;
}
  
export default Ember.Helper.helper(sliderClass);