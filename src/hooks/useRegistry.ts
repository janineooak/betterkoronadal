import { useEffect, useState } from 'react';
import {
  fetchPublished,
  mergeRegistry,
  registryPeople,
} from '../lib/registryApi';
import type { RegistryPerson } from '../data/officialsRegistry';

/**
 * Returns the registry people, starting from the static code-curated base and
 * merging in any admin-published additions/edits + approved sensitive items
 * once they load. With no backend deployed, this is exactly the static list.
 */
export function useRegistry(): RegistryPerson[] {
  const [people, setPeople] = useState<RegistryPerson[]>(registryPeople);

  useEffect(() => {
    let active = true;
    fetchPublished().then(published => {
      if (active && published)
        setPeople(mergeRegistry(registryPeople, published));
    });
    return () => {
      active = false;
    };
  }, []);

  return people;
}
