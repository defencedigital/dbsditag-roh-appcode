import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from 'src/services/config.service';
import { RollOfHonour } from 'src/roll_of_honour/roll_of_honour.entity';
import { formatInitialCap } from 'src/utils/utils';
import { join } from 'path';
import * as fs from 'fs';
import { Response as Res } from 'express';
import { ServicepersonSummary } from 'src/types/types';

@Injectable()
export class ServicepersonService {
  setCorpLabel(service: string) {
    let corpLabel = 'Corps';
    switch (service) {
      case ConfigService.ROYAL_FLEET_AUXILIARY:
      case ConfigService.ROYAL_NAVY:
        corpLabel = 'Ship / Unit';
        break;
      case ConfigService.ROYAL_AIR_FORCE:
        corpLabel = 'Squadron';
        break;
      case ConfigService.ARMY:
        corpLabel = 'Regiment';
        break;
      case ConfigService.MERCHANT_NAVY:
        corpLabel = 'Regiment';
        break;
    }

    return corpLabel;
  }

  formatAddress(result: RollOfHonour): string | null {
    return result.cemetery_address_1
      ? [
          result.cemetery_address_1 ?? null,
          result.cemetery_address_2 ?? null,
          result.cemetery_address_3 ?? null,
          result.cemetery_address_4 ?? null,
        ].join('<br>')
      : null;
  }

  getField({
    field,
    labelText,
  }: {
    field: string | number | undefined;
    labelText: string;
  }) {
    if (!field) return null;

    return {
      key: { text: labelText },
      value: { text: field },
    };
  }

  formatSummary({
    result,
    cemetery_address,
  }: {
    result: RollOfHonour;
    cemetery_address: string | null;
  }) {
    return [
      this.getField({ labelText: 'Last name', field: result.surname }),
      this.getField({
        labelText: 'First name(s) / Initial(s)',
        field: formatInitialCap(result.forenames),
      }),
      this.getField({ labelText: 'Rank', field: result.rank }),
      this.getField({ labelText: 'Service', field: result.service }),
      this.getField({ labelText: 'Service Number', field: result.service_no }),
      this.getField({
        labelText: this.setCorpLabel(result.service),
        field: result.regt_corps,
      }),
      this.getField({ labelText: 'Decorations', field: result.decorations }),
      this.getField({ labelText: 'Date of Birth', field: result.birth_date }),
      this.getField({ labelText: 'Age', field: result.age }),
      this.getField({ labelText: 'Date of Death', field: result.death_date }),
      this.getField({
        labelText: 'Cemetery Name',
        field: result.cemetery_name,
      }),
      cemetery_address
        ? {
            key: { text: 'Cemetery Address' },
            value: { html: cemetery_address },
          }
        : null,
      this.getField({
        labelText: 'Grave Section',
        field: result.grave_section,
      }),
      this.getField({ labelText: 'Grave Row', field: result.grave_row }),
      this.getField({ labelText: 'Grave Number', field: result.grave_number }),
      this.getField({
        labelText: 'Included on the Armed Forces Memorial',
        field: result.memorial?.toLowerCase?.() === 'yes' ? 'Yes' : 'No',
      }),
      this.getField({
        labelText: 'Included on Roll of Honour',
        field: result.nom_roll?.toLowerCase() === 'yes' ? 'Yes' : 'No',
      }),
    ];
  }

  getServicepersonSummary(result: RollOfHonour): ServicepersonSummary[] {
    const cemetery_address: string | null = this.formatAddress(result);
    return this.formatSummary({ result, cemetery_address });
  }

  getOutputForRollOfHonour(result, newLine = '\n') {
    const summary = [
      this.getField({ labelText: 'Last name', field: result.surname }),
      {
        key: { text: 'First name(s) / Initial(s)' },
        value: {
          text: result.forenames
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('-'),
        },
      },
      this.getField({
        labelText: this.setCorpLabel(result.service),
        field: result.regt_corps,
      }),
      this.getField({ labelText: 'Rank', field: result.rank }),
      this.getField({ labelText: 'Service', field: result.service }),
      this.getField({ labelText: 'Service Number', field: result.service_no }),
      this.getField({ labelText: 'Decorations', field: result.decorations }),
      this.getField({ labelText: 'Date of Birth', field: result.birth_date }),
      this.getField({ labelText: 'Age', field: result.age }),
      this.getField({ labelText: 'Date of Death', field: result.death_date }),
    ];

    return summary.filter((item) => item !== null);
  }

  generatePdf(result: RollOfHonour, res: Res) {
    const PDFDocument = require('pdfkit-table');
    const SVGtoPDF = require('svg-to-pdfkit');
    const doc = new PDFDocument({ size: 'A4', margin: 10 });

    const docWidth = 595.28;
    const docHeight = 841.89;

    PDFDocument.prototype.addSVG = function (svg, x, y, options) {
      return SVGtoPDF(this, svg, x, y, options);
    };

    doc.registerFont(
      'Heading Font',
      join(__dirname, '../../../fonts/Roboto-Regular.ttf'),
    );
    doc.registerFont(
      'Subheading Font',
      join(__dirname, '../../../fonts/Roboto-Regular.ttf'),
    );
    doc.registerFont(
      'Board Font',
      join(__dirname, '../../../fonts/Roboto-Regular.ttf'),
    );
    doc.registerFont(
      'Heading Font',
      join(__dirname, '../../../fonts/Roboto-Regular.ttf'),
    );
    doc.registerFont(
      'Subheading Font',
      join(__dirname, '../../../fonts/Roboto-Regular.ttf'),
    );
    doc.registerFont(
      'Board Font',
      join(__dirname, '../../../fonts/Roboto-Regular.ttf'),
    );

    doc.rect(0, 0, docWidth, docHeight).lineWidth(75).stroke('#B99658');
    doc.rect(0, 0, docWidth, docHeight).lineWidth(50).stroke('#305C49');
    doc.rect(0, 0, docWidth, docHeight).lineWidth(50).stroke('#470976');

    const certificate = [
      {
        font: 'Subheading Font',
        size: 28,
        color: '#470976',
        text: 'ARMED FORCES\nMEMORIAL',
        nextLine: 1,
      },
      {
        font: 'Subheading Font',
        size: 28,
        color: '#470976',
        text: 'ROLL OF HONOUR',
        nextLine: 0.25,
      },
      {
        font: 'Subheading Font',
        size: 16,
        color: '#8C7243',
        text: 'TODAY    TOMORROW    FOREVER',
        nextLine: 1,
      },
    ];

    doc.text('', 0, 80);
    doc.text('', 0, 80);
    for (let content of certificate) {
      doc
        .font(content?.font ?? 'Helvetica')
        .fontSize(content.size ?? 20)
        .fillColor(content.color ?? '#000000')
        .text(content.text, { width: docWidth, align: 'center' })
        .moveDown(content.nextLine ?? 0.125);
    }

    const data = this.getOutputForRollOfHonour(result);

    const mapped = data.map((item, index) => {
      return {
        label: { label: item.key.text, width: 150 },
        value: {
          label:
            item.value.text?.toString().trim() ??
            item.value['html'].toString().trim(),
        },
      };
    });

    doc.table(
      {
        headers: [{ property: 'label' }, { property: 'value' }],
        datas: mapped,
      },
      {
        x: 180,
        hideHeader: true,
        width: 300,
        divider: {
          header: { disabled: true },
          horizontal: { disabled: true },
        },
        prepareRow: (row, rowData) =>
          doc.font('Board Font').fontSize(10).fillColor('#000000'),
      },
    );

    doc.addSVG(
      fs.readFileSync(join(__dirname, '../../../poppy.svg'), 'utf8'),
      0,
      docHeight - 586,
      {},
    );

    // Send the PDF to the client
    res.setHeader('Content-disposition', 'attachment; filename=afdm.pdf');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    doc.end();

    return new StreamableFile(doc);
  }
}
