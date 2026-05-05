# IT-Fix — Support Informatique


## Mapping du Thème

**Thème choisi : Support Informatique (Thème n°3)**

IT-Fix est un extranet métier permettant aux employés de soumettre des tickets de panne informatique, et aux techniciens de les traiter.

| Élément | Dans le sujet | Dans IT-Fix | Description |
|---------|--------------|-------------|-------------|
| Table A | Utilisateurs | Employés | Se connectent pour soumettre des tickets |
| Table B | Ressources | Techniciens | Spécialistes IT (Hardware, Software, Network) |
| Table C | Interactions | Tickets | Relie un employé à un technicien avec statut et date |
| Fichier | Document uploadé | Screenshot du bug | Image uploadée via Supabase Storage |

---

## Analyse d'Architecture Cloud

### Pourquoi Vercel + Supabase est plus logique financièrement ? (CAPEX vs OPEX)

Déployer une application sur un serveur physique traditionnel représente un investissement lourd en **CAPEX** (Capital Expenditure) : achat de machines, licences, infrastructure réseau et maintenance matérielle, engagés avant même la mise en production.

Avec Vercel et Supabase, on bascule vers un modèle **OPEX** (Operational Expenditure) : on paie uniquement ce qu'on consomme, sans investissement initial. Vercel offre un hébergement gratuit avec CI/CD automatique, et Supabase fournit une base PostgreSQL managée avec authentification et stockage sans serveur à gérer. Le risque financier est minimal et les coûts ne s'appliquent qu'en cas de croissance réelle.

### Comment Vercel gère-t-il la scalabilité ?

Un data center physique implique des contraintes fixes : racks de serveurs, climatisation, alimentation redondante. En cas de pic de trafic, il faut commander et installer du matériel — un processus qui prend des semaines.

Vercel repose sur une architecture **Serverless** et un **Edge Network** mondial. Chaque requête est traitée par une fonction isolée déployée au plus proche de l'utilisateur. La scalabilité est automatique : en pic de trafic, les instances se multiplient sans intervention humaine ; en période creuse, les ressources sont libérées. Pour IT-Fix, l'application reste performante qu'il y ait 10 ou 10 000 employés connectés, sans aucune gestion infrastructure.

### Données structurées vs non-structurées dans IT-Fix

**Données structurées** : les tables PostgreSQL dans Supabase — `employees`, `technicians` et `tickets` — avec schéma fixe, types, contraintes et relations. Elles sont interrogeables via SQL et sécurisées par les politiques RLS.

**Données non-structurées** : les captures d'écran (PNG/JPG) uploadées par les employés lors de la soumission d'un ticket. Ces fichiers sont stockés dans Supabase Storage (bucket `bug-screenshots`). Seule leur URL est sauvegardée dans la colonne `screenshot_url` de la table `tickets`, faisant le lien entre les deux types de données.

---

## Tech Stack

- **Frontend** : React + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend / BaaS** : Supabase (PostgreSQL + Auth + Storage + RLS)
- **Hébergement / CI/CD** : Vercel

## Lancer le projet localement

```bash
npm install
npm run dev
```
