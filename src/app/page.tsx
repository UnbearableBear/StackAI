'use client';

import { Suspense } from 'react';
import { useGoogleDriveConnection } from '@/hooks/queries/useConnections';
import ResourcesList from '@/components/ResourceList';
import ResourcesSkeleton from '@/components/ui/resources-skeleton';
import ActionBar from '@/components/ActionBar';
import { useKnowledgeBaseIdQueryParameter } from '@/hooks/useKnowledgeBaseIdQueryParameter';
import { useKnowledgeBase } from '@/hooks/queries/useKnowledgeBase';
import { Card, CardContent } from '@/components/ui/card';
import { usePreSelection } from '@/hooks/usePreSelection';

function GoogleDriveIntegration() {
  const { data: connection } = useGoogleDriveConnection();
  usePreSelection();
  if (!connection) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No Google Drive connection found. Please set up a Google Drive
            connection first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <ResourcesList />
      <ActionBar />
    </>
  );
}

function HomeSubtitle() {
  const { knowledgeBaseId } = useKnowledgeBaseIdQueryParameter();
  const { data: knowledgeBase, isLoading } = useKnowledgeBase(knowledgeBaseId);

  let subtitle = 'Select resources to create a new knowledge base';

  if (isLoading) {
    subtitle = 'Loading knowledge base...';
  }
  if (knowledgeBaseId && knowledgeBase) {
    subtitle = `Editing knowledge base: ${knowledgeBase.name}`;
  }

  return <p className="text-lg text-muted-foreground">{subtitle}</p>;
}

export default function Main() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            StackAI Google Drive Integration
          </h1>
          <HomeSubtitle />
        </div>

        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<ResourcesSkeleton count={10} />}>
            <GoogleDriveIntegration />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
