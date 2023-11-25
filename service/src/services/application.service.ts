import { Inject, Injectable, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { SessionProvider } from '../providers/session.provider';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject(ConfigService.SESSION) private session: Record<string, any>,
  ) {
    session[ConfigService.SECTION_COMPLETE] =
      session[ConfigService.SECTION_COMPLETE] ?? 0;
  }

  sectionComplete(section: number) {
    return this.session[ConfigService.SECTION_COMPLETE] & section;
  }
  markSectionInComplete(section) {
    this.session[ConfigService.SECTION_COMPLETE] =
      this.session[ConfigService.SECTION_COMPLETE] & ~section;
  }

  resetOneCompletedSection(sections: number[] = []) {
    sections.forEach((section) => {
      if (this.sectionComplete(section)) {
        this.markSectionInComplete(section);
      }
    });
  }
  resetCompletedSections() {
    this.session[ConfigService.SECTION_COMPLETE] = 0;
    return this;
  }

  markSectionComplete(section) {
    this.session[ConfigService.SECTION_COMPLETE] =
      this.session[ConfigService.SECTION_COMPLETE] | section;
    return this;
  }

  firstIncompleteSection() {
    let sections = ConfigService.SECTION_PATHS;
    if (this?.session?.sessionFormAnswers)
      sections = this.filterSectionsBasedOnPathway(this.session);

    const keys = Object.keys(sections);
    for (const element of keys) {
      const currentKey = element;
      if (!this.sectionComplete(Number(currentKey))) {
        return sections[currentKey];
      }
    }
  }

  filterSection(sectionsToDelete: any[]) {
    const updatedSections = Object.assign({}, ConfigService.SECTION_PATHS);
    sectionsToDelete?.map((section) => {
      delete updatedSections[section];
    });
    return updatedSections;
  }

  filterSectionsBasedOnPathway(session) {
    const sessionFormAnswers = session.sessionFormAnswers;
    if (!sessionFormAnswers) {
      return ConfigService.SECTION_PATHS;
    }

    let filteredPaths = {};
    const sectionsToFilter = [];

    filteredPaths = this.filterSection(sectionsToFilter);

    return filteredPaths;
  }

  nextSection(path: string): string {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    try {
      const obj = this.filterSectionsBasedOnPathway(this.session);
      const keys = Object.keys(obj);

      for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i];
        const currentValue = obj[currentKey];

        if (this.sectionComplete(Number(currentKey))) {
          if (currentValue === path) {
            return obj[keys[i + 1]];
          }
        }
      }
      return '/result';
    } catch (e) {}
  }

  getIntFromText = (section) => {
    const sections =
      ConfigService.SECTION_PATHS ??
      this.filterSectionsBasedOnPathway(this.session);

    const keys = Object.keys(sections);

    for (let i = 0; i < keys.length; i++) {
      const currentKey = sections[keys[i]];

      if (currentKey === section) {
        return i;
      }
    }
  };
}

@Module({
  providers: [ApplicationService, SessionProvider],
})
export class ApplicationModule {}
