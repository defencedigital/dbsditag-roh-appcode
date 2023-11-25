import { Injectable } from '@nestjs/common';
import {
  IPaginationLinks,
  IPaginationMeta,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ResultsPageData } from 'src/types/types';
import { RollOfHonour } from 'src/roll_of_honour/roll_of_honour.entity';
import { formatInitialCap } from 'src/utils/utils';

interface PaginationLink {
  href: string;
  html: string;
}

interface Item {
  number: number;
  href: string;
  current: boolean;
}

interface IPaginationLinksExtended {
  first?: string;
  previous?: {
    href: string;
    html: string;
  };
  next?: PaginationLink;
  last?: string;
  total?: number;
  items?: Item[];
}

@Injectable()
export class ResultsService {
  formatRowData(row: RollOfHonour) {
    return [
      { text: row.surname },
      {
        text: formatInitialCap(row.forenames),
      },
      { text: row.service },
      { text: row.rank },
      {
        html: `<a href="/serviceperson/${row.id}" class="govuk-link">View
                  <span class="govuk-visually-hidden">${formatInitialCap(
                    row.forenames,
                  )} ${row.surname}</span>
                </a>`,
        classes: 'govuk-table__cell--numeric',
      },
    ];
  }

  createPaginationButton(buttonType: 'Next' | 'Previous') {
    return (
      '<span class="govuk-pagination__link-title">Previous</span>\n' +
      buttonType +
      '<span class="govuk-visually-hidden">&nbsp; page</span>'
    );
  }

  formatLinks({
    links,
    maxPages,
    currentPage,
  }: {
    links: IPaginationLinks;
    maxPages: number;
    currentPage: number;
  }) {
    const items = [];
    let paginationLinks: IPaginationLinksExtended = {
      first: links.first,
      last: links.last,
    };

    const ellipsis = { ellipsis: true };
    for (let i = 1; i <= maxPages; i++) {
      if (
        i === 1 ||
        i === maxPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        items.push({
          number: i,
          href: `/result?page=${i}`,
          current: i === currentPage,
        });
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        items.push(ellipsis);
      }
    }

    paginationLinks.items = items;

    if (links.previous) {
      paginationLinks.previous = {
        href: links.previous,
        html: this.createPaginationButton('Previous'),
      };
    }
    if (links.next) {
      paginationLinks.next = {
        href: links?.next,
        html: this.createPaginationButton('Next'),
      };
    }
    return paginationLinks;
  }

  formatSearchResult(
    result: Pagination<RollOfHonour, IPaginationMeta>,
    page: number,
  ): ResultsPageData {
    const maxPages = Math.ceil(
      result.meta.totalItems / result.meta.itemsPerPage,
    );

    const formattedResult: ResultsPageData = {
      head: [
        { text: 'Last name' },
        { text: 'First name(s)' },
        { text: 'Service' },
        { text: 'Rank' },
        { text: '' },
      ],
      rows: result.items?.map?.((row) => this.formatRowData(row)),
      meta: result.meta,
      links: this.formatLinks({
        links: result.links,
        maxPages,
        currentPage: page,
      }),
      total: result.meta?.totalItems,
    };
    return formattedResult;
  }
}
