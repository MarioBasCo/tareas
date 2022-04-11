import { DbfireService } from './../services/dbfire.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @Input() obj: any;
  @Input() titulo: string;
  detalle: string = '';
  estado: boolean = true;

  constructor(
    private modalCtrl: ModalController, 
    private database: DbfireService,
    private toastController: ToastController) { }

  ngOnInit() {
    if(this.obj?.id.length > 0){
      console.log(this.obj.id)
      this.detalle = this.obj.detalle;
      this.estado = this.obj.estado;
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    const data = {
      detalle: this.detalle,
      estado: this.estado
    }
    if(this.obj?.id.length > 0){
      this.database.update('tareas', this.obj.id, data).then(res => {
        this.cerrarModal();
        this.mostrarMensaje('Se modifico el registro con éxito');
      }).catch(err => {
        console.log("Error al modificar: ", err)
      });
    } else {
      this.database.create('tareas', data).then(res => {
        console.log(res);
        this.cerrarModal();
        this.mostrarMensaje('Información creada con éxito');
      }).catch(err => {
        console.log("error en alta: ", err);
      });
    }
  }

  async mostrarMensaje(message, color='success', duration=3000){
    const toast = await this.toastController.create({
      message,
      color,
      duration
    });
    toast.present();
  }

}
