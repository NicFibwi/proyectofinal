export default async function PokemonDetailsPage({
  params,
}: {
  params: { name: string };
}) {
  const name = (await params).name;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold capitalize">{name}</h1>
    </div>
  );
}
