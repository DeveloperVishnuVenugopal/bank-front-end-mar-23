import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const toast = inject(ToasterService)
  const router = inject(Router)
  if(auth.isLoggined()){
    return true;
    
  }
  else{
    toast.showWarning("Please login","warning")
    router.navigateByUrl("")
    return false; 
  }
 
};
