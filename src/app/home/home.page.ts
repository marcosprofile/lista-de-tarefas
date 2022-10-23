import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TarefaService } from 'src/app/services/tarefa.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  tarefaCollection: any[]=[];
  
  constructor( private alertCtrl: AlertController,
               private tarefaService: TarefaService,
               private actionSheetCtrl: ActionSheetController) {}

  ionViewDidEnter() {
    this.listarTarefa();
  }

  listarTarefa() {
    this.tarefaCollection = this.tarefaService.listar();
  }

  async showAdd(){
    const alert = await this.alertCtrl.create({
      header: 'Informe a tarefa',
      inputs: [
        {
          name: 'tarefa',
          type: 'text',
          placeholder: 'Descreva sua tarefa'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        },
        {
          text: 'Salvar',
          handler: (tarefa) => {
              this.tarefaService.salvar(tarefa, () => {
                this.listarTarefa();
              });
            }
        }
      ]
    });

    await alert.present();
  }

  delete(item) {
    this.tarefaService.delete(item, () => {
      this.listarTarefa();
    });
  }

  async openActions(tarefa: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O que deseja fazer?',
      buttons: [{
        text: tarefa.feito ? 'Colocar como Pendente' : 'Marcar como Realizada',
        icon: tarefa.feito ? 'close-outline' : 'checkmark-circle',
        handler: () => {
          tarefa.feito = !tarefa.feito;

          this.tarefaService.atualizar(tarefa, () => {
            this.listarTarefa();
          });
        }
      }
        ,{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    await actionSheet.present();
  }
}
