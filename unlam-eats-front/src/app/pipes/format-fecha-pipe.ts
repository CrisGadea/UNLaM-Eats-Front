import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'formatFecha',
  standalone: true
})
export class FormatFechaPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: string | Date | null | undefined): string {

    if (!value) {
      return '-';
    }

    try {

      const formattedDate = this.datePipe.transform(value, 'dd/MM/yy, HH:mm');
      return formattedDate || '-';

    } catch (error) {
      console.error('Error al formatear la fecha:', value, error);
      return '-';
    }
  }
}
