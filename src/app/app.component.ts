import { Component, OnInit } from '@angular/core';
import { CarService } from './services/car.service';
import { Car } from './models/car';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  car = {} as Car;
  cars: Car[];
  mensagem: {};
  classesCss: {};
  private currentTimout: any;

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.getCars();
  }

  // defini se um carro será criado ou atualizado
  saveCar(form: NgForm) {
    if (this.car.id !== undefined) {
      this.carService.updateCar(this.car).subscribe(() => {
        this.mostrarMensagem({
          tipo: 'warning',
          texto: 'Contato Atualizado com sucesso!'
        });
        this.cleanForm(form);
      });
    } else {
      this.carService.saveCar(this.car).subscribe(() => {
        this.mostrarMensagem({
          tipo: 'success',
          texto: 'Novo Contacto adicionado com sucesso!'
        });
        this.cleanForm(form);
      });
    }
  }

  // Chama o serviço para obtém todos os carros
  getCars() {
    this.carService.getCars().subscribe((cars: Car[]) => {
      this.cars = cars;
    });
  }

  // deleta um carro
  deleteCar(car: Car) {
    this.carService.deleteCar(car).subscribe(() => {
      this.getCars();
      this.mostrarMensagem({
        tipo: 'danger',
        texto: 'Contacto apagado com sucesso!'
      });
    });
  }

  // copia o carro para ser editado.
  editCar(car: Car) {
    this.car = { ...car };
  }

  // limpa o formulario
  cleanForm(form: NgForm) {
    this.getCars();
    form.resetForm();
    this.car = {} as Car;
  }

  private mostrarMensagem(mensagem: { tipo: string, texto: string }): void {// metodo privado
    this.mensagem = mensagem;
    this.mostrarClasses(mensagem.tipo);
    if (mensagem.tipo !== 'danger') {
      if (this.currentTimout) {
        clearTimeout(this.currentTimout); // cansela i timeOut anterior
      }
      this.currentTimout = setTimeout(() => {
        this.mensagem = undefined;
      }, 3000);
    } else {
      setTimeout(() => {
        this.mensagem = undefined;
      }, 6000);
    }

  }

  private mostrarClasses(tipo: string): void {
    this.classesCss = {
      // 'alert': true, //erro
      alert: true,
    };
    this.classesCss['alert-' + tipo] = true; // alert-danger, alert-success, ...

  }
}
