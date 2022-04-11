import { RegisterPage } from './../register/register.page';
import { DbfireService } from './../services/dbfire.service';
import { Component } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: any[] = [];
  selected: string = 'incomplete';
  obj = {
    id: '',
    detalle: '',
    estado: true,
  }

  constructor(
    private database: DbfireService,
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController) { }

  ionViewDidEnter() {
    this.database.getAll('tareas').then(
      firebaseResp => {
        firebaseResp.subscribe(data => {
          this.items = [];
          data.forEach((element: any) => {
            this.items.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            })
          });
          this.items = this.items.filter(d => d.estado == true);
          console.log(this.items);
        });
      }
    );
  }


  segmentChanged(event: any) {
    this.selected = event.target.value;
    console.log('Segment changed', event);
    this.database.getAll('tareas').then(
      firebaseResp => {
        firebaseResp.subscribe(data => {
          this.items = [];
          data.forEach((element: any) => {
            this.items.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            })
          });
          if (this.selected == 'incomplete') {
            this.items = this.items.filter(d => d.estado == true);
          } else {
            this.items = this.items.filter(d => d.estado == false);
          }

          console.log(this.items);
        });
      }
    );
  }

  async eliminar(id) {
    const alert = await this.alertController.create({
      header: '!!Alerta¡¡',
      message: '¿Esta seguro de eliminar el registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.database.delete('tareas', id).then(res => {
              this.mostrarMensaje('Se eliminó con éxito');
            }).catch(err => {
              console.log("ERROR al eliminar ", err);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  terminar(data){
    data.estado = false;
    this.database.update('tareas', data.id, data).then(res => {
      this.mostrarMensaje('Se modifico el registro con éxito');
    }).catch(err => {
      console.log("Error al modificar: ", err)
    });
  }

  async mostrarMensaje(message, color = 'success', duration = 3000) {
    const toast = await this.toastController.create({
      message,
      color,
      duration
    });
    toast.present();
  }

  async modalRegister() {
    const modal = await this.modalController.create({
      component: RegisterPage,
      componentProps: {
        titulo: 'Registro',
        obj: this.obj
      },
      showBackdrop: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async modalEdit(data : any) {
    const modal = await this.modalController.create({
      component: RegisterPage,
      componentProps: {
        titulo: 'Edición',
        obj: data
      },
      showBackdrop: true,
      backdropDismiss: false
    });
    return await modal.present();
  }
}
