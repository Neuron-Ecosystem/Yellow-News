export default function Footer() {
    return (
        <footer className="bg-dark-card border-t border-dark-border mt-20">
            <div className="container-custom py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-yellow-primary font-bold text-lg mb-4">Yellow News</h3>
                        <p className="text-gray-400 text-sm">
                            Честные, нейтральные и проверяемые новости без манипуляций и кликбейта.
                        </p>
                    </div>

                    {/* Principles */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Наши принципы</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li>✓ Факты без эмоций</li>
                            <li>✓ Честность важнее скорости</li>
                            <li>✓ Никакой пропаганды</li>
                            <li>✓ Обязательные источники</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Контакты</h3>
                        <p className="text-gray-400 text-sm">
                            Email: info@yellownews.ru
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            © {new Date().getFullYear()} Yellow News
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
